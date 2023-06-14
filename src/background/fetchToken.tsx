
export function fetchToken(interactive: boolean): Promise<string> {

    return new Promise((resolve, reject) => {
        chrome.identity.getAuthToken({ interactive: interactive }, (token) =>{
            if(token) {
                resolve (token);
            } else {
                chrome.identity.clearAllCachedAuthTokens(() => {
                    console.log("Cleared all cached");
                });
                reject("Error getting token");
            }
        });
    });
}
