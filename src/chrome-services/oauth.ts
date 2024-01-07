import log from "../utils/logger";
import { AuthFlowResponse } from "../types";
import { HttpRequest } from '../types/types';
import { makeRequest } from "./httpRequests";

const client_secret = process.env.REACT_APP_CLIENT_SECRET;

const { oauth2 } = chrome.runtime.getManifest();
const redirectUri = chrome.identity.getRedirectURL();

function createAuthUrl() {

    if (!oauth2 || !oauth2.client_id || !oauth2.scopes) {
        throw new Error('Invalid oauth2 configuration');
    }

    var authParams = new URLSearchParams({
        access_type: 'offline',
        client_id: oauth2.client_id,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: oauth2.scopes.join(' '),
    });

    return `https://accounts.google.com/o/oauth2/auth?${authParams.toString()}`;
}

// launches the 
export function chromeLaunchWebAuthFlow(): Promise<AuthFlowResponse> {
    return new Promise((resolve, reject) => {
        chrome.identity.launchWebAuthFlow({ url: createAuthUrl(), interactive: true }, (async (responseUrl: string | undefined) => {

            if (chrome.runtime.lastError || !responseUrl) {     // if there was an error or the user closed the window
                reject(chrome.runtime.lastError);
            }
            else {
                const url = new URL(responseUrl);

                var params = Object.fromEntries((url.searchParams).entries());

                log('chromeLaunchWebAuthFlow Response\n    URL: ', responseUrl, '\n    Params: ', params);

                const response: AuthFlowResponse = {
                    url: responseUrl,
                    code: params.code
                };
                
                resolve(response);
            }
        }));
    });
}

export function getTokenFromAuthCode(redirectURI:string, code: string): Promise<string> {
    return new Promise((resolve, reject) => {
        log('client_secret: ', client_secret)

        if (!oauth2 || !oauth2.client_id || !oauth2.scopes || !client_secret) {
            log('oauth2: ', oauth2);
            throw new Error('Invalid oauth2 configuration');
        }

        makeRequest({
            url: 'https://www.googleapis.com/oauth2/v4/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ',
            },
            body: {
                code: code,
                client_id: oauth2.client_id,
                client_secret: client_secret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code'
            }
        }).then((response: any) => {
            response = JSON.parse(response.body);
            log('getTokenFromAuthCode Response: ', response);
            
            resolve(response.access_token);
        }).catch((error: any) => {
            reject(error);
        });
        
    });
}