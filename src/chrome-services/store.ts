import log from '../utils/logger';

export interface Storage {
    key: string;
    newValue: any;
}

/**
 * Sets the session data in the Chrome storage.
 * @param data - The data to be stored in the session.
 * @returns A promise that resolves when the session data is set.
 * @group chrome-services
 */
export async function setSessionStore(data: Storage) {
    chrome.storage.session.set(data, () => {
        log('Session set');
    });
}

/**
 * Retrieves the value associated with the specified key from the session storage.
 * @param key - The key of the value to retrieve.
 * @returns A promise that resolves with the retrieved value.
 * @group chrome-services
 */
export async function getSessionStore(key: string) {
    return new Promise((resolve) => {
        chrome.storage.session.get(key, (data) => {
            resolve(data);
        });
    });
}

/**
 * Removes the value associated with the specified key from the session storage.
 * @param key - The key of the value to remove.
 * @group chrome-services
 */
export async function removeSession(key: string) {
    chrome.storage.session.remove(key, () => {
        log('Session removed');
    });
}