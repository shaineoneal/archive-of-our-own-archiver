import log from "../utils/logger";
import { getStore, StoreMethod } from "./store";
import { HttpMethod, makeRequest } from "./utils/httpRequest";

/**
 * Retrieves the refresh token from Chrome storage.
 * 
 * @category chrome-services
 * @returns A promise that resolves with the refresh token string.
 */
export function getRefreshToken(): Promise<string> {
    return new Promise((resolve, reject) => {
        getStore('refresh_token', StoreMethod.SYNC).then((data: any) => {
            if (data.refresh_token) {
                resolve(data.refresh_token);
            } else {
                resolve('');
            }
        });
    });
}


/**
 * Retrieves a valid refresh token from Chrome storage.
 * 
 * If the refresh token does not exist in storage, it will throw an error.
 * 
 * @category chrome-services
 * @returns A promise that resolves with a valid refresh token string.
 * @throws An error if the refresh token does not exist in storage.
 */
export async function getValidRefreshToken(): Promise<string> {
    log('getValidRefreshToken')

    const refreshToken = await getRefreshToken() 

    if (!refreshToken) {
        throw new Error('Refresh token is undefined');
    }

    return refreshToken;
}

/**
 * Revokes the given access token.
 * 
 * @category chrome-services
 * @param accessToken The access token to revoke.
 * @returns A promise that resolves with no value.
 * @throws {Error} If the request to revoke the token fails.
 */
export async function revokeTokens(accessToken: string): Promise<void> {
    log('revokeTokens')

    //const response = await makeRequest({
    //    url: `https://oauth2.googleapis.com/revoke?token=${accessToken}`,
    //    method: HttpMethod.POST,
    //    headers: {
    //        'Content-Type': 'application/x-www-form-urlencoded',
    //    }
    //});
//
    //log('response', response);
//
    //if (!response.ok) {
    //    throw new Error('Failed to revoke refresh token');
    //}
}