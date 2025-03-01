import { HttpMethod, makeRequest } from './httpRequest.ts';
import { SyncUserStore } from "@/utils/zustand";
import { setAccessTokenCookie } from "@/utils/browser-services/cookies.ts";

const client_id = import.meta.env.WXT_API_CLIENT_ID;
const client_secret = import.meta.env.WXT_API_CLIENT_SECRET;

/**
 * Makes a request to exchange the refresh token for an access token.
 *
 * @param {string} refreshT - The refresh token.
 * @returns {Promise<Response>} - The response from the OAuth2 server.
 */
const requestAccessToken = (refreshT: string): Promise<Response> => {
    if(!client_id || !client_secret) {
        throw new Error('Invalid oauth2 configuration');
    }
    return makeRequest({
        url: 'https://oauth2.googleapis.com/token',
        method: HttpMethod.POST,
        headers: {
            'Content-Type': 'application/json',
        },
        body: {
            client_id: client_id,
            client_secret: client_secret,
            refresh_token: refreshT,
            grant_type: 'refresh_token',
        },
    });
};

/**
 * Parses the response from the OAuth2 server.
 *
 * @param {Response} response - The response from the OAuth2 server.
 * @returns {Promise<string>} - The access token.
 * @throws {Error} - Throws an error if the response is not ok or if there is an error parsing the response.
 */
const parseAccessTokenResponse = async (response: Response): Promise<string> => {
    const parsedResponse = await response.json();
    console.log('exchangeRefreshForAccessToken parsedResponse: ', parsedResponse);
    if (!response.ok) {
        throw new Error(parsedResponse.error);
    }
    return parsedResponse.access_token;
};

/**
 * Fetches a new access token using the OAuth2 refresh token.
 * 
 * This function first checks if the OAuth2 configuration is valid, retrieves the refresh token from session storage,
 * and makes a POST request to the OAuth2 server to obtain a new access token.
 * 
 * @returns {Promise<string>} A promise that resolves with the new access token.
 * @throws {Error} Throws an error if the OAuth2 configuration is invalid or if there is an error getting the refresh token.
 * @group accessToken-
 * @see {@link https://www.xiegerts.com/post/chrome-extension-google-oauth-refresh-token/ | Handling Google OAuth Refresh Tokens in a Chrome Extension}
*/
export async function exchangeRefreshForAccessToken(refreshT: string): Promise<string | undefined> {
    if (!client_id || !client_secret) {
        throw new Error('Invalid oauth2 configuration');
    }

    if (refreshT === undefined) {
        throw new Error('Error getting refresh token');
    }



    const response = await requestAccessToken(refreshT);
    console.log('exchangeRefreshForAccessToken Response: ', response);

    try {
        return await parseAccessTokenResponse(response);
    } catch (error) {
        console.log('Error parsing response: ', error);
        throw new Error('Error exchanging refresh token for access token');
    }
}

/**
 * Validates the given access token by making a request to the OAuth2 token info endpoint.
 *
 * @async
 * @param {string} token - The access token to validate.
 * @returns {Promise<boolean>} A promise that resolves with true if the token is valid, otherwise false.
 * @throws {Error} Throws an error if there is an issue with the request.
 */
export async function isAccessTokenValid(token: string): Promise<boolean> {
    console.log('isAccessTokenValid token: ', token);

    if (token === '') {
        return false;
    }

    try {
        const response = await fetch('https://oauth2.googleapis.com/tokeninfo?access_token=' + token, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (response.ok) {
            const data = await response.json();
            console.log('isAccessTokenValid data: ', data);
            return data.aud === client_id;
        }
    } catch (error) {
        throw new Error('Error validating token');
    }
    return false;
}

/**
 * Retrieves a valid access token, either by validating the current one or exchanging the refresh token.
 *
 * @async
 * @param {string} accessToken - The current access token.
 * @param {string} refreshToken - The refresh token to exchange for a new access token if the current one is invalid.
 * @returns {Promise<string>} A promise that resolves with a valid access token.
 * @throws {Error} Throws an error if unable to retrieve a valid access token.
 */
export async function getValidAccessToken(accessToken: string, refreshToken: string): Promise<string> {
    console.log('Checking access token validity:', accessToken);
    if (await isAccessTokenValid(accessToken)) {
        console.log('Access token is valid');
        return accessToken;
    } else {
        console.log('Access token is invalid, attempting to exchange refresh token: ', refreshToken);
        const newAccessToken = await exchangeRefreshForAccessToken(refreshToken);
        if (newAccessToken) {
            console.log('New access token obtained:', newAccessToken);
            return newAccessToken;
        } else {
            throw new Error('Unable to retrieve a valid access token');
        }
    }
}

export async function handleTokenExchange<T>(refreshToken: string): Promise<T> {
    const {setAccessToken} = SyncUserStore.getState().actions;
    try {
        const newAccessToken = await exchangeRefreshForAccessToken(refreshToken);
        console.log('newAccessToken', newAccessToken);
        if (newAccessToken) {
            setAccessToken(newAccessToken);
            await setAccessTokenCookie(newAccessToken);
            console.log('newAccessToken set');
            return true as unknown as T;
        } else {
            console.log('Error exchanging refresh token for access token');
            return false as unknown as T;
        }
    } catch (error) {
        console.log('Error exchanging refresh token for access token', error);
        return false as unknown as T;
    }
}