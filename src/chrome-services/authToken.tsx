import { log } from '../utils/logger';

export function fetchToken(interactive?: boolean): Promise<string> {
    return new Promise((resolve) => {

        if (interactive === true) {
            //getting token interactively
            log('getting token interactively');
            chrome.identity.getAuthToken({interactive: true}, (token) => {
                if (token) {
                    resolve(token);
                } else {
                    chrome.identity.clearAllCachedAuthTokens(() => {
                        log('Cleared all cached');
                        resolve(''); // TODO: make an actual error
                    });
                }
            });
        } else {
            // get token from identity API
            chrome.identity.getAuthToken({ interactive: false }, (token) => {
                    if (token) {
                        resolve(token);
                    } else {
                        chrome.identity.clearAllCachedAuthTokens(() => {
                            log('Cleared all cached');
                            resolve(''); // TODO: make an actual error
                        });
                        }
                    }
                );
        //} else {
        //    // check for token saved in storage
        //    chrome.storage.sync.get('authToken', (result) => {
        //        const token = result.authToken;
        //        if (token !== undefined) {
        //            log('user has token: ', token);
        //            resolve(token);
        //        } else {
        //            resolve('');
        //        }
        //    });
        //}
                }
    });
}

export async function removeToken() {
    const token = await fetchToken();

    if (token === '') {
        throw new Error('Error getting token');
    }
    chrome.storage.sync.remove(['authToken']);
    // remove identity token
    chrome.identity.removeCachedAuthToken({ token: token });
}
// Get the user's saved token from chrome storage
export async function getSavedToken() {
    return new Promise<string>((resolve) => {
        chrome.storage.sync.get('authToken', (result) => {
            const token = result.authToken;
            if (token !== undefined) {
                log('user has token: ', token);
                resolve(token);
            } else {
                resolve('');
            }
        });
    });
}