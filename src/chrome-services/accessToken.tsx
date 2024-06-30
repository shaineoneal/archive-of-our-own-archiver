import log from '../utils/logger';
import { getSessionStore } from './store';
import { HttpRequest, makeRequest, HttpMethod } from './utils/httpRequest';
import { getSessionRefreshToken } from './refreshToken';

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
        getSessionRefreshToken().then(async (refreshToken) => {
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
    return new Promise((resolve) => {
        getSessionStore('authToken').then((data: any) => {
            if (data.authToken) {
                resolve(data.authToken);
            } else {
                resolve('');
            }
        });
    });
}

export async function isAccessTokenValid(): Promise<boolean> {
    const token = await getAccessToken();
    if (token == '') {
        return false;
    }
    return true;    
}