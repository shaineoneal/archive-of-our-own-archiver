import log from "../utils/logger";
import { getStore, StoreMethod } from "./store";

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
 * Retrieves and validates the refresh token. Rejects if refresh token is undefined.
 * @returns A promise that resolves with the validated refresh token.
 */
export async function getValidRefreshToken(): Promise<string> {
    log('getValidRefreshToken')

    const refreshToken = await getRefreshToken() 

    if (!refreshToken) {
        throw new Error('Refresh token is undefined');
    }

    return refreshToken;
}
