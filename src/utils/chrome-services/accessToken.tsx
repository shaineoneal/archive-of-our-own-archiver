import log from '../logger';
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
    if (!response.ok) {
        return undefined;
    }

    const parsedResponse = await response.json();
    log('exchangeRefreshForAccessToken Parsed Response: ', parsedResponse);
    return parsedResponse.access_token;
}

/**
 * Validates the given access token by making a request to the OAuth2 token info endpoint.
 *
 * @async
 * @param {string} token - The access token to validate.
 * @returns {Promise<string>} A promise that resolves with the token if it is valid.
 * @throws {Error} Throws an error if the token is invalid.
 */
export async function isAccessTokenValid(token: string): Promise<string> {
    if (token === '') {
        throw new Error('Token is invalid');
    }

    const response = await makeRequest({
        url: 'https://oauth2.googleapis.com/tokeninfo?access_token=' + token,
        method: HttpMethod.GET,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    });

    if (response.ok) {
        return token;
    } else {
        return '';
    }
}