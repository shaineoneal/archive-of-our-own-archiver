import log from '../utils/logger';

export const enum  StoreMethod {
    SYNC = 'SYNC',
    LOCAL = 'LOCAL',
    SESSION = 'SESSION',
}

/**
 * Sets the session data in the Chrome storage.
 * @param data - The data to be stored in the session.
 * @returns A promise that resolves when the session data is set.
 * @group chrome-services
 * @see https://afc70caa-77d6-47b2-b99f-def7d423e3de.pieces.cloud/?p=2cf546af5a
 */
export async function setStore(key: string, value: any, method: StoreMethod) {
    log('Store set: ', key, value);
    switch (method) {
        case StoreMethod.SYNC:
            chrome.storage.sync.set({[key]: value}, () => {
                log('Sync set');
            });
            break;
        case StoreMethod.LOCAL:
            chrome.storage.local.set({[key]: value}, () => {
                log('Local set');
            });
            break;
        case StoreMethod.SESSION:
            chrome.storage.session.set({[key]: value}, () => {
                log('Session set');
            });
            break;
    }
}

/**
 * Retrieves the value associated with the specified key from the session storage.
 * @param key - The key of the value to retrieve.
 * @returns A promise that resolves with the retrieved value.
 * @group chrome-services
 * @see https://afc70caa-77d6-47b2-b99f-def7d423e3de.pieces.cloud/?p=cfac41bd78
 */
export async function getStore(key: string, method: StoreMethod) {
    return new Promise((resolve, reject) => {
        switch (method) {
            case StoreMethod.SYNC:
                chrome.storage.sync.get(key, (data) => {
                    log('Sync retrieved: ', key, data);
                    resolve(data);
                });
                break;
            case StoreMethod.LOCAL:
                chrome.storage.local.get(key, (data) => {
                    log('Local retrieved: ', key, data);
                    resolve(data);
                });
                break;
            case StoreMethod.SESSION:
                chrome.storage.session.get(key, (data) => {
                    log('Session retrieved: ', key, data);
                    resolve(data);
                });
                break;
            default:
                reject('Invalid method');
        } 
    });
}


/**
 * Removes a session from the Chrome storage based on the specified key and method.
 * @param key - The key of the session to be removed.
 * @param method - The method of the storage (SYNC, LOCAL, or SESSION).
 * @see https://afc70caa-77d6-47b2-b99f-def7d423e3de.pieces.cloud/?p=03ff4aa7d3
 */
export async function removeStore(key: string, method: StoreMethod) {

    switch (method) {
        case StoreMethod.SYNC:
            chrome.storage.sync.remove(key, () => {
                log('Sync removed');
            });
            break;
        case StoreMethod.LOCAL:
            chrome.storage.local.remove(key, () => {
                log('Local removed');
            });
            break;
        case StoreMethod.SESSION:
            chrome.storage.session.remove(key, () => {
                log('Session removed');
            });
            break;
    }
}