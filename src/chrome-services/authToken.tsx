import { log } from '../utils/logger';

/** get token from identity API
 * 
 * @param interactive = true if you want to ask the user for permission to access their google account
 * @returns token or empty string
 */
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
            });
        }
    });
}

//remove token from chrome storage and identity API
export async function removeToken() {
    const token = await fetchToken();

    if (token === '') {
        throw new Error('Error getting token');
    }
    chrome.storage.sync.remove(['authToken']);
    // remove all identity tokens
    chrome.identity.clearAllCachedAuthTokens(() => {
        log('Cleared all cached');
    })
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