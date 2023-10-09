import { log } from '../utils/logger';
import { launchWebAuthFlow } from './utils/oauthSignIn';

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
    const token = await getSavedToken();

    if (token === '') {
        throw new Error('Error getting token');
    }
    chrome.storage.sync.remove(['authToken']);
    // remove all identity tokens
    chrome.cookies.remove({
        name: 'authToken',
        url: 'https://archiveofourown.org',
    }, () => {
        log('Removed cookie');
    });
}


// Get the user's saved token from chrome storage
export async function getSavedToken() {
    return new Promise<string>((resolve, reject) => {
        chrome.cookies.get({
            name: 'authToken',
            url: 'https://archiveofourown.org',
        }, (cookie) => {
            if (cookie) {
                log('cookie.value: ', cookie.value);
                resolve(cookie.value);
            } else {
                reject('Error getting token');
            }
        });
    });
}

export function doesTokenExist(): Boolean {
    if (globalThis.AUTH_TOKEN) return true;
    else return false;
}