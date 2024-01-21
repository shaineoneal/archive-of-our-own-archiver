import log from "../utils/logger"

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
