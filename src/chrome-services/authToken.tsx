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
    const token = await getAccessToken();

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

/**
 * Retrieves the access token from a cookie.
 * @returns A promise that resolves to the access token string.
 * @throws An error if the access token cannot be retrieved.
 */
export async function getAccessToken(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        chrome.cookies.get({
            name: 'authToken',
            url: 'https://archiveofourown.org',
        }, (cookie) => {
            if (cookie) {
                log('Access token cookie.value: ', cookie.value);
                resolve(cookie.value);
            } else {
                reject('Error getting token');
            }
        });
    });
}

export async function isAccessTokenValid(): Promise<boolean> {
    const token = await getAccessToken();
    if (token == '') {
        return false;
    }
    return true;    
}