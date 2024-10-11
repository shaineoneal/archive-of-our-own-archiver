import log from '../utils/logger';
import { getRefreshToken, getValidRefreshToken } from './refreshToken';
import { getStore, StoreMethod } from './store';
import { HttpMethod, HttpRequest, HttpResponse, makeRequest } from './utils/httpRequest';

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
export async function exchangeRefreshForAccessToken(refreshT: string): Promise<string> {
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
        throw new Error(response.statusText);
    }

    const parsedResponse = await response.json();
    log('fetchNewAccessToken Response: ', parsedResponse);
    return parsedResponse.access_token;
}

//remove token from chrome storage and identity API
export async function removeToken() {
    const token = await getLocalAccessToken();

    if (token === '') {
        throw new Error('Error getting token');
    }
    chrome.storage.sync.remove(['authToken']);
    // remove all identity tokens
    chrome.cookies.remove({
        name: 'authToken',
        url: 'https://archiveofourown.org',
    }, () => {
        log('Removed cookie');
    });
}

/**
 * Retrieves the access token from a cookie.
 * @returns A promise that resolves to the access token string.
 * @throws An error if the access token cannot be retrieved.
 * @group accessToken
 * @see {@link https://afc70caa-77d6-47b2-b99f-def7d423e3de.pieces.cloud/?p=e077418731}
 */
export async function getLocalAccessToken(): Promise<string> {
    log('getLocalAccessToken');
    return new Promise((resolve, reject) => {
        getStore('accessToken', StoreMethod.LOCAL).then((data: any) => {
            if (data.accessToken) {
                log('getLocalAccessToken', 'accessToken', data.accessToken);
                resolve(data.accessToken);
            } else {
                log('no accessToken found');
                reject();
            }
        });
    });
}


/**
 * ![accessTokenFlow](./accessTokenFlow.png)
 * Checks if the access token is valid by making a request to the Google OAuth2 tokeninfo endpoint.
 * @returns A Promise that resolves with the valid access token or rejects if the token is invalid.
 * @async
 * @group accessToken
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
        throw new Error('Token is invalid');
    }
}



/**
 * Checks if the access token is valid by first checking local storage and then sync storage for the token.
 *
 * @returns {Promise<string>} A Promise that resolves with the valid access token or rejects if the token is invalid.
 * @throws {Error} Throws an error if no token is found.
 * @async
 * @group accessToken
 */
export async function getValidAccessToken(): Promise<string> {
    try {
        log('getValidAccessToken');
        // Get the access token from local storage
        let token = await getLocalAccessToken();
        // If the token is not undefined, check if it is valid
        if (token !== undefined) {
            await isAccessTokenValid(token);
            // If the token is valid, return it
            return token;
        } else {
            // If no token is found, throw an error
            throw new Error('No token found');
        }
    } catch (error) {
        // If there is an error, log it and rethrow the error
        log('Token is invalid: ', error);
        throw error;
    }
}

