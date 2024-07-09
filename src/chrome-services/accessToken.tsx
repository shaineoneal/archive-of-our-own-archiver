import log from '../utils/logger';
import { getLocalRefreshToken } from './refreshToken';
import { getStore, StoreMethod } from './store';
import { HttpMethod, HttpRequest, makeRequest } from './utils/httpRequest';

const { oauth2 } = chrome.runtime.getManifest();
const client_secret = process.env.REACT_APP_CLIENT_SECRET;
const redirectUri = chrome.identity.getRedirectURL();

/**
 * Fetches a new access token using the OAuth2 refresh token.
 * 
 * This function checks if the OAuth2 configuration is valid, retrieves the refresh token from session storage,
 * and makes a POST request to the OAuth2 server to obtain a new access token.
 * 
 * @returns {Promise<string>} A promise that resolves with the new access token.
 * @throws {Error} Throws an error if the OAuth2 configuration is invalid or if there is an error getting the refresh token.
 * @group accessToken
*/
export function fetchNewAccessToken(): Promise<string> {

    if (!oauth2 || !client_secret) {
        throw new Error('Invalid oauth2 configuration');
    }

    return new Promise((resolve, reject) => {
        //get refresh token from session storage
        getLocalRefreshToken().then(async (refreshToken) => {
            if (refreshToken === '') {
                log('Error getting refresh token');
                reject('Error getting refresh token');
            }
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    client_id: oauth2.client_id,
                    client_secret: client_secret,
                    refresh_token: refreshToken,
                    grant_type: 'refresh_token',
                }),
            };
            //const request: HttpRequest = {
            //    url: 'https://oauth2.googleapis.com/token',
            //    method: HttpMethod.POST,
            //    headers: {
            //        'Content-Type': 'application/x-www-form-urlencoded',
            //    },
            //    body: {
            //        client_id: oauth2.client_id,
            //        client_secret: client_secret,
            //        refresh_token: refreshToken,
            //        grant_type: 'refresh_token',
            //    },
            //};

            fetch("https://oauth2.googleapis.com/token", options).then(async (response) => {
                const parsedResponse = await response.json();
                log('fetchNewAccessToken Response: ', parsedResponse);
                resolve(parsedResponse.access_token);
            });
        });
    });
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
    
    return new Promise(async (resolve, reject) => {
        log('isAccessTokenValid', token);
        if (token != '') {
            makeRequest({
                url: 'https://oauth2.googleapis.com/tokeninfo?access_token=' + token,
                method: HttpMethod.GET,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            }).then((response) => {
                if (response.status === 200) {
                    log('Token is valid: ', response);
                    resolve(token);
                } else {
                    log('Token is invalid: ', response);
                    reject();
                }
            })
        } else {
            log('Token is invalid: ', token);
            reject();
        }
    });
}