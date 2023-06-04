import { sheetURL } from "./sheet";

async function handleAuthentication() {
    //make sure getAuthToken worked
    console.log("handleAuthentication");
    try {   
        const token = await getAuthToken();
        //make sure getAuthToken returned the token
        console.log("getAuthToken success", token);
        //get the sheet URL from local storage
        const url: string = await sheetURL(token);
        //make sure sheetURL returned the URL
        console.log("sheetURL success", url);
    } catch (error) {
        console.log("Error in handleAuthentication:", error);
    }
}

function getAuthToken() {
    return new Promise<string>((resolve, reject) => {
        try {
            chrome.identity.getAuthToken({ interactive: true }, (token) => {
                console.log("Got the token", token);
                chrome.storage.sync.set({ authToken: token });
                resolve(token);
            });
        } catch (error) {  
            console.log("Error in getAuthToken:", chrome.runtime.lastError);
            chrome.identity.clearAllCachedAuthTokens(() => {
                console.log("Cleared all cached");
            });
            reject(chrome.runtime.lastError);
        }             
    });
}





chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ isLoggedIn: false });
});

chrome.runtime.onMessage.addListener(async function (buttonClicked, sender, sendResponse) {
    console.log(buttonClicked.reason);
    if (buttonClicked.reason === "login") {
        console.log("login heard");
        try {
            await handleAuthentication();
            console.log("Authentication successful");
            sendResponse({ success: true });
        } catch (error) {
            console.log("Authentication failed: ", error);
            sendResponse({ success: false, error: error });
        }
        return true; // Return true to indicate that sendResponse will be used asynchronously
      } else if (buttonClicked.reason === "update") {
        getAuthToken();
        return true; // Return true to indicate that sendResponse will be used asynchronously
      }
    });