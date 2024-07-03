import log from "../utils/logger";
import { getStore, StoreMethod } from "./store";

/**
 * Retrieves the refresh token from Chrome storage.
 * 
 * @category chrome-services
 * @returns A promise that resolves with the refresh token string.
 */
export function getSyncedRefreshToken(): Promise<string> {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['refresh_token'], (result) => {
            if (chrome.runtime.lastError) {
                log('Error getting refresh token: ', chrome.runtime.lastError);
                reject(chrome.runtime.lastError);
            }
            else {
                log('refresh token: ', result.refresh_token);
                resolve(result.refresh_token);
            }
        });
    });
}

/**
 * Retrieves the local refresh token.
 * @returns A promise that resolves with the local refresh token.
 */
export function getLocalRefreshToken(): Promise<string> {
    return new Promise((resolve, reject) => {
        getStore('refresh_token', StoreMethod.LOCAL).then((data: any) => {
            if (data.refresh_token) {
                resolve(data.refresh_token);
            } else {
                resolve('');
            }
        });
    });
}