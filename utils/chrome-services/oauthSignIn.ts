import { log } from "@/utils/logger.ts";
import { HttpMethod, makeRequest } from './httpRequest.ts';

const client_secret = import.meta.env.WXT_API_CLIENT_SECRET;

const client_id = import.meta.env.WXT_API_CLIENT_ID;
const scopes = import.meta.env.WXT_API_SCOPES;
const redirectUri = import.meta.env.WXT_API_REDIRECT_URI;

/**
 * Creates the URL for the OAuth authorization flow.
 * 
 * @returns The authorization URL.
 * @throws An error if the OAuth2 configuration is invalid.
 * @see {@link https://developers.google.com/identity/protocols/oauth2/web-server#authorization-code-flow | Google Identity API - Authorization code flow}
 */
const createAuthUrl = (): string => {
    log('redirectUri: ', redirectUri);
    log('oauth2: ', client_id);
    log('scopes: ', scopes);
    if (!client_id || !scopes) {
        throw new Error('Invalid oauth2 configuration');
    }


    const authParams = new URLSearchParams({
        access_type: 'offline',
        client_id: client_id,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: scopes
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
 * @property {string} refresh_token - (optional) A long-lived token used to obtain new access tokens.
 * @property {string} scope - The scope of the access token.
 * @property {string} token_type - The type of token.
 */
export interface AuthRequestResponse {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
    scope: string;
    token_type: string;
}

/**
 * The function `chromeLaunchWebAuthFlow` launches a web authentication flow using the Chrome Identity
 * API and returns a promise that resolves with the response URL and authorization code.
 * 
 * ```
 * chrome.identity.chromeLaunchWebAuthFlow(
 *      details: WebAuthFlowDetails,
 *      callback?: function,
 * )
 * ```
 * @see {@link  https://developer.chrome.com/docs/extensions/reference/identity/#method-chromeLaunchWebAuthFlow | Chrome Developer API Reference - chromeLaunchWebAuthFlow }
 * @returns The function `chromeLaunchWebAuthFlow` is returning a Promise that resolves to an
 * {@link AuthFlowResponse} object.
 * 
 */
export function  chromeLaunchWebAuthFlow(interactive: boolean): Promise<AuthFlowResponse> {
    return new Promise((resolve, reject) => {
        chrome.identity.launchWebAuthFlow({ url: createAuthUrl(), interactive: interactive }, (async (responseUrl: string | undefined) => {

            if (chrome.runtime.lastError || !responseUrl) {     // if there was an error or the user closed the window
                log('chromeLaunchWebAuthFlow Error: ', chrome.runtime.lastError);
                reject(chrome.runtime.lastError);
            }
            else {
                const url = new URL(responseUrl);

                const params = Object.fromEntries((url.searchParams).entries());

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
export function requestAuthorization(authFlowResponse: AuthFlowResponse): Promise<AuthRequestResponse> {
    return new Promise((resolve, reject) => {

        if (!client_id || !scopes || !client_secret) {
            log('requestAuth oauth2: ', client_id);
            if (!client_secret) {
                log('requestAuth client_secret: ', client_secret);
            }
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
                client_id: client_id,       // TODO: fix assertation
                client_secret: client_secret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code'
            },
        }).then(async (response) => {
            const parsedResponse = await response.json();
            log('requestAuthorization Response: ', parsedResponse);
            resolve(parsedResponse);
            
        }).catch((error: any) => {
            reject(error);
        });
        
    });
} 