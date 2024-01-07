import { HttpRequest } from '../types/types';
import { makeRequest } from './httpRequests';
//import { sendHttpRequest } from './httpRequests';

const client_secret = process.env.REACT_APP_CLIENT_SECRET;
const { oauth2 } = chrome.runtime.getManifest();

function refreshAccessToken(refreshToken: string): Promise<string> {

    if (!oauth2 || !client_secret) {
        throw new Error('Invalid oauth2 configuration');
    }

    return new Promise((resolve, reject) => {
        getRefreshToken()
            .then(async (refreshToken) => {
                const request: HttpRequest = {
                    url: 'https://oauth2.googleapis.com/token',
                    method: 'POST',
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

function getRefreshToken(): Promise<string> {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['refreshToken'], (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            else {
                // make a request to the server to refresh the token
                resolve(result.refreshToken);
            }
        });
    });
}
export function retrieveToken(): Promise<string> {
    return new Promise((resolve, reject) => {
        chrome.identity.getAuthToken({ interactive: true }, (token) => {
            if (chrome.runtime.lastError || !token) {
                reject(chrome.runtime.lastError);
            }
            else {
                resolve(token);
            }
        });
    });
}

export function revokeToken(token: string): Promise<void> {

    //if successful HTTP response code will be 200
    return new Promise<void>((resolve, reject) => {
        chrome.identity.removeCachedAuthToken({ token }, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            else {
                resolve();
            }
        });
        // add logic for requesting from 'https://oauth2.googleapis.com/revoke'
        // ex: curl -d -X -POST --header "Content-type:application/x-www-form-urlencoded" \
        //     https://oauth2.googleapis.com/revoke?token={token}
    });
}