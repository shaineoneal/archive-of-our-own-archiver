import log from "../../utils/logger";

interface Cookie {
    domain?: string;
    expirationDate?: number;
    hostOnly?: boolean;
    httpOnly?: boolean;
    name?: string;
    path?: string;
    sameSite?: "unspecified" | "no_restriction" | "lax" | "strict";
    secure?: boolean;
    storeId?: string;
    url: string;
    value?: string;
}

export function createCookie(cookie: Cookie) {
    return new Promise((resolve, reject) => {
        chrome.cookies.set(cookie, (cookie) => {
            if (cookie) {
                log('createCookie cookie', cookie);
            }
            resolve(cookie);
        });
    });
}

export function getCookie(cookieName: string, url: string) {
    log('getting cookie', cookieName, url);
    return new Promise((resolve) => {
        chrome.cookies.get({ name: cookieName, url: url }, (cookie) => {
            if (cookie) {
                log('getCookie cookie', cookie);
                resolve(cookie);
            }
            else {
                resolve('');
            }
        });
    });
}