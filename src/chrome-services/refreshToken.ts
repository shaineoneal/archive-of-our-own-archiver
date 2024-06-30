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
                reject(chrome.runtime.lastError);
            }
            else {
                resolve(result.refresh_token);
            }
        });
    });
}