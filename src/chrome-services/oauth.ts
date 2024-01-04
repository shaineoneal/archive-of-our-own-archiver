import log from "../utils/logger";
import { AuthFlowResponse } from "../types";

function createAuthUrl() {

    const { oauth2 } = chrome.runtime.getManifest();
    const redirectUri = chrome.identity.getRedirectURL();

    if (!oauth2 || !oauth2.client_id || !oauth2.scopes) {
        throw new Error('Invalid oauth2 configuration');
    }

    var authParams = new URLSearchParams({
        client_id: oauth2.client_id,
        redirect_uri: redirectUri,
        response_type: 'token',
        scope: oauth2.scopes.join(' '),
    });

    return `https://accounts.google.com/o/oauth2/auth?${authParams.toString()}`;
}

// launches the 
export function chromeLaunchWebAuthFlow() {
    return new Promise((resolve, reject) => {
        const authUrl = createAuthUrl();
        chrome.identity.launchWebAuthFlow({ url: authUrl, interactive: true }, (async (redirectUri: any) => {
            
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            else {
                var params: any = new URLSearchParams(new URL(redirectUri).search);
                params = Object.fromEntries(params.entries());

                log('URL: ', redirectUri, '\nParams: ', params);
//                const response: AuthFlowResponse = {
//                    url: redirectUri,


                //const params = new URLSearchParams(url.search);

                //log('URL: ', url, '\nParams: ', params);
                
                resolve(redirectUri);
            }
        }));
    });
}