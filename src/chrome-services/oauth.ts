import log from "../utils/logger";
import { HttpMethod, HttpRequest, makeRequest } from './httpRequests';

const client_secret = process.env.REACT_APP_CLIENT_SECRET;

const { oauth2 } = chrome.runtime.getManifest();
const redirectUri = chrome.identity.getRedirectURL();

const createAuthUrl = (): string => {

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

    log('Auth URL Params: ', authParams.toString());

    return `https://accounts.google.com/o/oauth2/auth?${authParams.toString()}`;
}

/**
 * The AuthFlowResponse type represents the response object containing a URL and a code.
 * @property {string} url - A string representing the URL for the authentication flow.
 * @property {string} code - The `code` property is a string that represents the authorization code
 * generated during the authentication flow. This code is typically used to exchange for an access
 * token, which can then be used to make authorized API requests.
 */
export interface AuthFlowResponse {
    url: string,
    code: string
}

/**
 * Represents the response of an authentication request.
 * 
 * @property {string} access_token - Short lived token used to access Google APIs.
 * @property {number} expires_in - The number of seconds the access token is valid for.
 * @property {string} refresh_token - (optional) A long lived token used to obtain new access tokens.
 * @property {string} scope - The scope of the access token.
 * @property {string} token_type - The type of token.
 */
export interface AuthRequestResponse {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
    scope: string;
    token_type: string;
};

/**
 * The function `chromeLaunchWebAuthFlow` launches a web authentication flow using the Chrome Identity
 * API and returns a promise that resolves with the response URL and authorization code.
 * 
 * ```
 * chrome.identity.launchWebAuthFlow(
 *      details: WebAuthFlowDetails,
 *      callback?: function,
 * )
 * ```
 * @see {@link  https://developer.chrome.com/docs/extensions/reference/identity/#method-launchWebAuthFlow | Chrome Developer API Reference - launchWebAuthFlow }
 * @returns The function `chromeLaunchWebAuthFlow` is returning a Promise that resolves to an
 * {@link AuthFlowResponse} object.
 * 
 */
export function  chromeLaunchWebAuthFlow(): Promise<AuthFlowResponse> {
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

/**
 * Retrieves a token from the authorization code obtained during the OAuth flow.
 * 
 * @param authFlowResponse The response object containing the authorization code.
 * @returns A promise that resolves to the token request response.
 * @see {@link https://developers.google.com/identity/protocols/oauth2/web-server#exchange-authorization-code | Google Identity API - Exchange authorization code for refresh and access tokens}
 */
export function requestAuthorizaton(authFlowResponse: AuthFlowResponse): Promise<AuthRequestResponse> {
    return new Promise((resolve, reject) => {
        log('client_secret: ', client_secret)

        if (!oauth2 || !oauth2.client_id || !oauth2.scopes || !client_secret) {
            log('oauth2: ', oauth2);
            throw new Error('Invalid oauth2 configuration');
        }

        makeRequest({
            url: 'https://www.googleapis.com/oauth2/v4/token',
            method: HttpMethod.POST,
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ',
            },
            body: {
                code: authFlowResponse.code,
                client_id: oauth2.client_id,
                client_secret: client_secret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code'
            }
        }).then((response: any) => {
            response = JSON.parse(response.body);
            log('requestAuthorization Response: ', response);
            resolve(response);
            
        }).catch((error: any) => {
            reject(error);
        });
        
    });
}
