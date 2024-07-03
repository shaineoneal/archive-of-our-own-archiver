import log from '../utils/logger';
import { getStore, StoreMethod } from './store';
import { HttpRequest, makeRequest, HttpMethod } from './utils/httpRequest';
import { getLocalRefreshToken } from './refreshToken';

const { oauth2 } = chrome.runtime.getManifest();
const client_secret = process.env.REACT_APP_CLIENT_SECRET;

/**
 * Fetches a new access token using the refresh token.
 * @returns A promise that resolves to a string representing the new access token.
 */
export function fetchNewAccessToken(): Promise<string> {

    if (!oauth2 || !client_secret) {
        throw new Error('Invalid oauth2 configuration');
    }

    return new Promise((resolve) => {
        //get refresh token from session storage
        getLocalRefreshToken().then(async (refreshToken) => {
            if (refreshToken === '') {
                throw new Error('Error getting refresh token');
            }

            const request: HttpRequest = {
                method: HttpMethod.POST,
                url: 'https://oauth2.googleapis.com/token',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: {
                    client_id: oauth2.client_id,
                    client_secret: client_secret,
                    refresh_token: refreshToken,
                    grant_type: 'refresh_token',
                },
            };

            await makeRequest(request);
        });
    });
}

//remove token from chrome storage and identity API
export async function removeToken() {
    const token = await getAccessToken();

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
 * @group chrome-services
 */
export async function getAccessToken(): Promise<string> {
    log('getAccessToken');
    return new Promise((resolve, reject) => {
        getStore('accessToken', StoreMethod.LOCAL).then((data: any) => {
            if (data.accessToken) {
                log('getAccessToken', 'accessToken', data.accessToken);
                resolve(data.accessToken);
            } else {
                log('no accessToken found');
                reject();
            }
        });
    });
}

/**
 * Checks if the access token is valid by making a request to the Google OAuth2 tokeninfo endpoint.
 * @returns A Promise that resolves to a boolean indicating whether the access token is valid.
 */
export async function isAccessTokenValid(): Promise<string> {
    
    return new Promise(async (resolve, reject) => {
        getAccessToken().then(async (token) => {
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
        }).catch((error) => {
            log('Error getting token: ', error);
            reject();
        });
    });
}