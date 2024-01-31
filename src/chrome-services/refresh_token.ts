import log from '../utils/logger'

/**
 * Checks if the user has a refresh token stored in the Chrome sync storage and 
 * returns it if available.
 */

export function doesUserHaveRefreshToken(): Promise<string> {
    log('Checking if user has refresh token...');
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['refresh_token'], (result) => {
            if (chrome.runtime.lastError) {
                log('Error retrieving refresh token: ', chrome.runtime.lastError);
                reject(chrome.runtime.lastError);
            }
            else {
                if (result.refresh_token) {
                    log('User has refresh token: ', result.refresh_token);
                    resolve(result.refresh_token);
                }
            }
        });
    });
}