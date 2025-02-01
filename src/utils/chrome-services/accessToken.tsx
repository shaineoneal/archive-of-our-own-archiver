import { log } from '../logger';
import { HttpMethod, makeRequest } from './httpRequest';

const { oauth2 } = chrome.runtime.getManifest();
const client_secret = process.env.REACT_APP_CLIENT_SECRET;
const redirectUri = chrome.identity.getRedirectURL();

/**
 * Fetches a new access token using the OAuth2 refresh token.
 * 
 * This function first checks if the OAuth2 configuration is valid, retrieves the refresh token from session storage,
 * and makes a POST request to the OAuth2 server to obtain a new access token.
 * 
 * @returns {Promise<string>} A promise that resolves with the new access token.
 * @throws {Error} Throws an error if the OAuth2 configuration is invalid or if there is an error getting the refresh token.
 * @group accessToken
 * @see {@link https://www.xiegerts.com/post/chrome-extension-google-oauth-refresh-token/ | Handling Google OAuth Refresh Tokens in a Chrome Extension}
*/
export async function exchangeRefreshForAccessToken(refreshT: string): Promise<string | undefined> {
    if (!oauth2 || !client_secret) {
        throw new Error('Invalid oauth2 configuration');
    }

    if (refreshT === undefined) {
        throw new Error('Error getting refresh token');
    }

    const response = await makeRequest({
        url: 'https://oauth2.googleapis.com/token',
        method: HttpMethod.POST,
        headers: {
            'Content-Type': 'application/json',
        },
        body: {
            client_id: oauth2.client_id,
            client_secret: client_secret,
            refresh_token: refreshT,
            grant_type: 'refresh_token',
        },
    });
    log('exchangeRefreshForAccessToken Response: ', response);

    const parsedResponse = await response.json();
    log('exchangeRefreshForAccessToken Parsed Response: ', parsedResponse);
    if (!response.ok) {
        throw new Error('Error exchanging refresh token for access token');
    }
    return parsedResponse.access_token;
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
    if (token === '') {
        return false;
    }

    try {
        const response = await makeRequest({
            url: 'https://oauth2.googleapis.com/tokeninfo?access_token=' + token,
            method: HttpMethod.GET,
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (response.ok) {
            const data = await response.json();
            return data.aud === oauth2!.client_id;
        }
    } catch (error) {
        throw new Error('Error validating token');
    }
    return false;
}