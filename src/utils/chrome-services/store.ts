import log from '../logger';

/**
 * Enum representing the storage methods.
 */
export const enum StoreMethod {
    SYNC = 'SYNC',
    LOCAL = 'LOCAL',
    SESSION = 'SESSION',
}

/**
 * Handles storage operations.
 *
 * @param method - The storage method to use.
 * @param action - The action to perform ('set', 'get', 'remove').
 * @param key - The key for the storage item.
 * @param value - The value to set (only for 'set' action).
 * @returns The result of the storage operation.
 */
function handleStore(method: StoreMethod, action: 'set' | 'get' | 'remove', key: string, value?: any): any {
    const storage = chrome.storage[method.toLowerCase()];
    const callback = (data?: any) => {
        log(`${method} ${action}: `, key, data || value);
        return data;
    };

    if (method === StoreMethod.SYNC) {
        return new Promise((resolve, reject) => {
            if (action === 'set') storage.set({ [key]: value }, (data) => resolve(callback(data)));
            else if (action === 'get') storage.get(key, (data) => resolve(callback(data)));
            else if (action === 'remove') storage.remove(key, (data) => resolve(callback(data)));
            else reject('Invalid action');
        });
    } else {
        if (action === 'set') return callback(storage.set({ [key]: value }));
        else if (action === 'get') return callback(storage.get(key));
        else if (action === 'remove') return callback(storage.remove(key));
        else throw new Error('Invalid action');
    }
}

/**
 * Sets a value in the specified storage method.
 *
 * @param key - The key for the storage item.
 * @param value - The value to set.
 * @param method - The storage method to use.
 * @returns A promise that resolves when the value is set.
 */
export const setStore = (key: string, value: any, method: StoreMethod) => handleStore(method, 'set', key, value);

/**
 * Gets a value from the specified storage method.
 *
 * @param key - The key for the storage item.
 * @param method - The storage method to use.
 * @returns A promise that resolves with the retrieved value.
 */
export const getStore = (key: string, method: StoreMethod) => handleStore(method, 'get', key);

/**
 * Removes a value from the specified storage method.
 *
 * @param key - The key for the storage item.
 * @param method - The storage method to use.
 * @returns A promise that resolves when the value is removed.
 */
export const removeStore = (key: string, method: StoreMethod) => handleStore(method, 'remove', key);