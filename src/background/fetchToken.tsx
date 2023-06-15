export function fetchToken(interactive: boolean): Promise<string> {

    return new Promise((resolve) => {
        chrome.identity.getAuthToken({ interactive: interactive }, (token) =>{
            if(token) {
                resolve (token);
            } else {
                chrome.identity.clearAllCachedAuthTokens(() => {
                    console.log("Cleared all cached");
                });
            }
        });
    });
}
