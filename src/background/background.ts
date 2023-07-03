import { fetchSpreadsheetUrl, fetchToken } from '../chrome-services';
import { log } from '../utils/logger';
import { Work } from '../works';
import { batchUpdate } from '../chrome-services';


//chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
//    log('message recieved', request);
//    if (request.message === 'getAuthToken') {
//        log('getAuthToken message recieved');
//        await fetchToken(false).then((token) => {
//            log('message token', token);
//            sendResponse({ token: token });
//
//        });
//        return true;
//    }
//});



chrome.runtime.onConnect.addListener(function (port) {
    port.onMessage.addListener(function (msg) {
        log('port message', msg);
        if (msg.message === 'getAuthToken') {
            log('getAuthToken message recieved');
            fetchToken(false).then((token) => {
                log('port token', token);
                port.postMessage({ token: token });
            });
        } else if (msg.message === 'fetchSpreadsheetUrl') {
            log('fetchSpreadsheetUrl message recieved');
            fetchSpreadsheetUrl().then((spreadsheetUrl) => {
                log('port spreadsheetUrl', spreadsheetUrl);
                port.postMessage({ spreadsheetUrl: spreadsheetUrl });
            });
        } else if (msg.message === 'batchUpdate') {
            log('batchUpdate message recieved');
            fetchToken(false).then((token) => {
                log('token', token);
                fetchSpreadsheetUrl().then((spreadsheetUrl) => {
                    batchUpdate(spreadsheetUrl, token, msg.work).then((response) => {
                        log('response', response);
                        port.postMessage({ response: response });
                    });
                });
            });





        
        }
    });
});

/*chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (
        changeInfo.status === 'complete' &&
        tab.url?.includes('archiveofourown.org')
    ) {
        try {
            await chrome.scripting
                .insertCSS({
                    target: { tabId: tabId, allFrames: true },
                    files: ['./js/content_script.css'],
                })
                .then(() => {
                    log('content_script.css injected');
                });
        } catch (error) {
            log('Error in insertCSS:', error);
        }
    }
});

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ isLoggedIn: false });
});

chrome.storage.onChanged.addListener(() => {
    chrome.storage.sync.get(["isLoggedIn"], (result) => {
        console.log("isLoggedIn: ", result.isLoggedIn);
    });
});    

chrome.tabs.onUpdated.addListener((tab) => {
    chrome.runtime.onMessage.addListener((isLoaded, sender, sendResponse) => {
        if (isLoaded) {
            (async () => {
                const response = await chrome.tabs.sendMessage(tab, { type: "getLoginStatus" });
                log("response", response);
            })();
        }
    });
});


async function getURL() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true, url: "*://*.archiveofourown.org/*" });
    const activeTab = tabs[0];
    if (!activeTab) {
        return;
    }
    const url = activeTab.url;
    log('url', url);
    return url;
}



            //var port = chrome.tabs.connect(id, { name: 'ao3' });
            //port.postMessage({ url: url });
            //port.onMessage.addListener(function (msg) {
            //    log('listener: msg', msg);
            //    if (msg.type === 'ao3') {
            //        log('listener: msg', msg);
            //        chrome.storage.sync.set({ isLoggedIn: msg.isLoggedIn });
            //    }
            //});



chrome.runtime.onMessage.addListener(async function (buttonClicked, sender, sendResponse) {
    console.log(buttonClicked.reason);
    if (buttonClicked.reason === "login") {
        console.log("login heard");
        try {
            await userLogin();
            console.log("Authentication successful");
            sendResponse({ success: true });
        } catch (error) {
            console.log("Authentication failed: ", error);
            sendResponse({ success: false, error: error });
        }
        return true; // Return true to indicate that sendResponse will be used asynchronously
      } else if (buttonClicked.reason === "logout") {
        try {
            chrome.identity.removeCachedAuthToken({ token: buttonClicked.reason}, () => {
                fetch(
                    "https://accounts.google.com/o/oauth2/revoke?token=" + buttonClicked.token,
                    { method: "GET" }
                ).then((response) => {
                    console.log("logout response", response);
                });
            });
            chrome.storage.sync.set({ isLoggedIn: false });
            sendResponse({ success: true });
        } catch (error) {
            console.log("Error in logout:", error);
            sendResponse({ success: false, error: error });
        }
        return true; // Return true to indicate that sendResponse will be used asynchronously
      }
    });

chrome.storage.onChanged.addListener(function (changes, namespace) {
    console.log("storage changed");
    //const loginStatus = getLoginStatus();
    for (const key in changes) {
        const storageChange = changes[key];
        console.log(storageChange);
    }
});
*/
