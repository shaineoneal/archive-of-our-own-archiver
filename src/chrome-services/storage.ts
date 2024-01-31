import log from "../utils/logger"

/**
 * Sets a value in chrome synchronized storage.
 * 
 * @param key - The key to set the value for.
 * @param value - The value to be set.
 * @returns A promise that resolves when the value is successfully set, or rejects with an error if there was an issue.
 * @see {@link https://developer.chrome.com/docs/extensions/reference/storage/ | Chrome Storage API}
 */
export function syncStorageSet(key: string, value: string) {
    return new Promise<void>((resolve, reject) => {
        chrome.storage.sync.set({ [key]: value }, () => {
            log('syncStorageSet: ', key, value);
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            else {
                resolve();
            }
        });
    });
}


/**
 * Retrieves the value associated with the specified key from the synchronized storage.
 * 
 * @param key - The key of the value to retrieve.
 * @returns A promise that resolves with the retrieved value as a string.
 */
export function syncStorageGet(key: string): Promise<string> {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get([key], (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            else {
                resolve(result[key]);
            }
        });
    });
}
