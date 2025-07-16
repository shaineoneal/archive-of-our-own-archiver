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
    const storage = (browser.storage as any)[method.toLowerCase()];
    const callback = (data?: any) => {
        console.log(`${method} ${action}: `, key, data || value);
        return data;
    };

    return new Promise((resolve, reject) => {
        if (action === 'set') storage.set({ [key]: value }, (data: any) => resolve(callback(data)));
        else if (action === 'get') storage.get(key, (data: any) => resolve(callback(data)));
        else if (action === 'remove') storage.remove(key, (data: any) => resolve(callback(data)));
        else reject('Invalid action');
    });
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