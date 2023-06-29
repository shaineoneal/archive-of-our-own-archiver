import { log } from "../utils/logger";

export function fetchToken(interactive: boolean): Promise<string> {
    return new Promise((resolve) => {
        if (interactive) {
            log("user doesn't have token");
            //get token from identity API
            chrome.identity.getAuthToken({ interactive: interactive }, (token) => {
                if (token) {
                    resolve(token);
                } else {
                    chrome.identity.clearAllCachedAuthTokens(() => {
                    log("Cleared all cached");
                    resolve("");      //TODO: make an actual error
                    });
                }
            });
        } else {
            //check for token saved in storage
            chrome.storage.sync.get("authToken", (result) => {
                const token = result.authToken;
                if (token !== undefined) {
                    log("user has token: ", token);
                    resolve(token);
                } else {
                    resolve("");
                }
            });
        }
    });
}

export async function removeToken() {
    const token = await fetchToken(false);

    if (token === "") {
        throw new Error("Error getting token");
    }
    
    chrome.identity.removeCachedAuthToken({ token: token }, () => {
        fetch("https://accounts.google.com/o/oauth2/revoke?token=" + token, {
        method: "GET",
    }).then((response) => {
        chrome.storage.sync.remove(["authToken"]);
        log("logout response", response);
    });});
}
