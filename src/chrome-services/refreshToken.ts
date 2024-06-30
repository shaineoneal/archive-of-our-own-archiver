import log from "../utils/logger";
import { getSessionStore } from "./store";

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
 * Retrieves the session refresh token.
 * @returns A promise that resolves with the session refresh token.
 */
export function getSessionRefreshToken(): Promise<string> {
    return new Promise((resolve, reject) => {
        getSessionStore('refresh_token').then((data: any) => {
            if (data.refresh_token) {
                resolve(data.refresh_token);
            } else {
                resolve('');
            }
        });
    });
}