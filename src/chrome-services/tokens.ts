import { syncStorageRemove } from '.';
import log from '../utils/logger';
import { HttpRequest, makeRequest, HttpMethod } from './httpRequests';
//import { sendHttpRequest } from './httpRequests';

const client_secret = process.env.REACT_APP_CLIENT_SECRET;
const { oauth2 } = chrome.runtime.getManifest();

function getNewAccessToken(refreshToken: string): Promise<string> {

    if (!oauth2 || !client_secret) {
        throw new Error('Invalid oauth2 configuration');
    }
//TODO: background.js
    return new Promise((resolve, reject) => {
        retrieveRefreshToken()
            .then(async (refreshToken) => {
                const request: HttpRequest = {
                    url: 'https://oauth2.googleapis.com/token',
                    method: HttpMethod.POST,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: {
                        client_id: oauth2.client_id,
                        client_secret: client_secret,
                        refresh_token: refreshToken,
                        grant_type: 'refresh_token',
                    }
                };
                await makeRequest(request);
            })
            .catch((err) => {
                reject(err);
        });
    });
}

/**
 * Retrieves the refresh token from Chrome storage.
 * 
 * @category chrome-services
 * @returns A promise that resolves with the refresh token string.
 */
export function retrieveRefreshToken(): Promise<string> {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['refresh_token'], (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            else {
                resolve(result.refresh_token);
            }
        });
    });
}

export async function revokeToken(token: string): Promise<void> {
    log('Revoking token: ', token);

    await makeRequest({
        url: `https://oauth2.googleapis.com/revoke?token=${token}`,
        method: HttpMethod.POST,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: ''
    }).then((response) => {
        log('Token revoked: ', response);
    }).then(() => {
        syncStorageRemove('refresh_token');
    });
    //if successful HTTP response code will be 200
/*    return new Promise<void>((resolve, reject) => {
        chrome.identity.clearAllCachedAuthTokens(() => {
    
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            else {
                log('All cached tokens cleared.');
                resolve();
            }
        });
        // add logic for requesting from 'https://oauth2.googleapis.com/revoke'
        // ex: curl -d -X -POST --header "Content-type:application/x-www-form-urlencoded" \
        //     https://oauth2.googleapis.com/revoke?token={token}
    });*/
}

/**
 * Retrieves the refresh token from Chrome storage.
 * 
 * @category chrome-services
 * @returns A promise that resolves with the refresh token string.
 */
export function retrieveAccessToken(): Promise<string> {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['access_token'], (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            else {
                resolve(result.access_token);
            }
        });
    });
}