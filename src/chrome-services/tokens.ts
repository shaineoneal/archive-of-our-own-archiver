import { get } from 'jquery';
import { HttpRequest } from '../types/types';
import { makeRequest } from './httpRequests';
//import { sendHttpRequest } from './httpRequests';

function refreshAccessToken(refreshToken: string): Promise<string> {
    return new Promise((resolve, reject) => {
        getRefreshToken()
            .then(async (refreshToken) => {
                const request: HttpRequest = {
                    accessToken: '',    // not needed for this request
                    url: 'https://oauth2.googleapis.com/token',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&refresh_token=${refreshToken}&grant_type=refresh_token`
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

function revokeToken(token: string) {

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