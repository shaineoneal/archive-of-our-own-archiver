import { log } from "../utils/logger";

export function fetchToken(interactive: boolean): Promise<string> {

    return new Promise((resolve) => {
        chrome.identity.getAuthToken({ interactive: interactive }, (token) =>{
            if(token) {
                resolve (token);
            } else {
                chrome.identity.clearAllCachedAuthTokens(() => {
                    log("Cleared all cached");
                });
            }
        });
    });
}

export async function removeToken() {
    const token = await fetchToken(false);

    if (token === null) {
        throw new Error("Error getting token");
    }
    chrome.identity.removeCachedAuthToken({ token: token }, () => {
        fetch(
            "https://accounts.google.com/o/oauth2/revoke?token=" + token,
            { method: "GET" }
        ).then((response) => {
            log("logout response", response);
        });
    });
}