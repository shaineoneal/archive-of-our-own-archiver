import log from '../../utils/logger';
import { UserStore } from "../../utils/zustand";
import { addWorkToSheet, MessageName, querySpreadsheet, receiveMessage } from "../../utils/chrome-services";
import { compareArrays } from "../../utils/compareArrays";

log('background script running');
//receiveMessage(
//    MessageName.AddWorkToSheet,
//    async (payload): Promise<boolean> => {
//        let syncUser = UserStore.getState().user;
//        if (syncUser.spreadsheetId !== undefined && syncUser.accessToken !== undefined) {
//            return await addWorkToSheet(syncUser.spreadsheetId, syncUser.accessToken, payload.work);
//
//        } else {
//            log(payload)
//            log('sessionUser', syncUser);
//            return false;
//        }
//    }
//);

//receiveMessage(
//    MessageName.QuerySpreadsheet,
//    async (payload): Promise<boolean[]> => {
//        let sessionUser = UserStore.getState().user;
//        if (sessionUser.spreadsheetId !== undefined && sessionUser.accessToken !== undefined) {
//            const response = await querySpreadsheet(sessionUser.spreadsheetId, sessionUser.accessToken, payload.list);
//            const responseArray = compareArrays(payload.list, response.table.rows);
//            log('responseArray', responseArray);
//            return responseArray;
//        } else {
//            log(payload)
//            log('sessionUser', sessionUser);
//
//        }
//        return [];
//    }
//);

//chrome.runtime.onConnect.addListener(function (port) {
//    log('checking access token');
//    let syncUser = UserStore.getState().user;
////
//    log('found syncUser', syncUser.accessToken);
    //userStoreLogin(syncUser.accessToken, syncUser.refreshToken);
    //});

    //TODO: set up session storage on connect (accessToken on timer) (cookie??)
    //port.onMessage.addListener(function (msg) {
    //    log('port message', msg);
    //    if (msg.message === 'getAuthToken') {
    //        log('getAuthToken message recieved');
    //        useSessionUser()
    //        //getLocalAccessToken().then((token) => {
    //    log('port token', token);
    //    port.postMessage({ token: token });
    //}).catch(() => {
    //    log('port token', 'none');
    //    chrome.scripting.executeScript({
    //        target: { tabId: port.sender?.tab?.id || 0 },
    //        func: () => {
    //            window.confirm('You need an auth token! Log back in?');
    //        }
    //    }).then((response) => {
    //        log('im a genius', response);
    //        chromeLaunchWebAuthFlow(false).then((cookie) => {
    //            log('cookie', cookie);
    //            chrome.runtime.reload();
    //            chrome.scripting.executeScript({
    //                target: { tabId: port.sender?.tab?.id || 0 },
    //                func: () => {
    //                   window.location.reload();
    //                }
    //            });
    //        });
    //    });
    //});
    //} else if (msg.message === 'fetchSpreadsheetUrl') {
    //    log('fetchSpreadsheetUrl message recieved');
    //fetchSpreadsheetUrl().then((spreadsheetUrl) => {
    //    log('port spreadsheetUrl', spreadsheetUrl);
    //    port.postMessage({ spreadsheetUrl: spreadsheetUrl });
    //});
    //} else if (msg.message === 'querySheet') {
    //    log('querySheet message recieved');
    //getLocalAccessToken().then((token) => {
    //    log('token', token);
    //    fetchSpreadsheetUrl().then((spreadsheetUrl) => {
    //        querySpreadsheet(spreadsheetUrl, token, msg.list).then((response) => {
    //            log('response', response);
    //            const responseArray = compareArrays(msg.list, response.table.rows);
    //            port.postMessage({ reason: 'querySheet', response: responseArray });
    //        });
    //    });
    //}).catch((error) => {
    //    log('error', error);
    //    port.postMessage({ reason: 'querySheet', response: error });
    //});
    //} else if (msg.message === 'sendLoginNotification') {
    //    log('sendLoginNotification message recieved');

    //}
    //});
//    port.onDisconnect.addListener(function () {
//        log('port disconnected');
//    });
//});


//});
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    let syncUser = UserStore.getState().user;
    log('msg from sender: ', sender)
    if (msg.message === 'checkLogin') {
        log('checkLogin message received');
        log('syncUser', syncUser);
        sendResponse({ loggedIn: syncUser.isLoggedIn });
    }
//TODO: change to outer check for user and handle accordingly
    if (msg.message === 'addWorkToSheet') {
        if (syncUser.spreadsheetId === undefined || syncUser.accessToken === undefined) {
            return;
        }
        log('addWorkToSheet message received');
        addWorkToSheet(syncUser.spreadsheetId, syncUser.accessToken, msg.work).then((response) => {
            log('sending response', response);
            sendResponse({response: response});
        });
        return true;
        //getLocalAccessToken().then((token) => {
        //    log('token', token);
        //    fetchSpreadsheetUrl().then((spreadsheetUrl) => {
        //        addWorkToSheet(spreadsheetUrl, token, msg.work).then((response) => {
        //            log('response', response);
        //            sendResponse({ response: response });
        //        });
        //    });
        //});
    } else if (msg.message === 'querySpreadsheet') {
        if (syncUser.spreadsheetId === undefined || syncUser.accessToken === undefined) {
            return;
        }
        log('querySheet message received');
        log('syncUser', syncUser);
        querySpreadsheet(syncUser.spreadsheetId, syncUser.accessToken, msg.list).then((response) => {
            log('querySheet response', response);

            if(response.status && response.status === "error") {
                log('querySheet error', response.error);
                sendResponse({ response: response.error });
                return;
            }
            const responseArray = compareArrays(msg.list, response.table.rows);
            log('responseArray', responseArray);
            sendResponse({ response: responseArray });
        });
        return true;
    }
    return true;
})
chrome.storage.onChanged.addListener((changes) => {
    log('storage changed', changes);
    log('user-store', changes['user-store']);
    if( changes['user-store'] ) {
        log('user changed', changes['user-store']);
        chrome.tabs.query({ url: "*://*.archiveofourown.org/*" }, (tabs) => {
            tabs.forEach((tab) => {
                log('sending message to tab', tab);
                chrome.tabs.sendMessage(tab.id!, {message: "userChanged", newUser: changes['user-store'].newValue})
                    .then((response) => {
                        chrome.runtime.reload();
                        chrome.tabs.reload(tab.id!).then(r => log('reloaded tab', r));
                        log('response from content script', response)
                    });

            });
        });
        //chrome.runtime.sendMessage({ message: "userChanged", newUser: changes.user.newValue });
    }
    //if(changes.spreadsheetUrl) {
    //    log('spreadsheetUrl changed', changes.spreadsheetUrl);
    //    chrome.runtime.sendMessage({ message: "spreadsheetUrlChanged", newUrl: changes.spreadsheetUrl.newValue });
    //}
});
//
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
    const tabs = await chrome.tabs.querySpreadsheet({ active: true, currentWindow: true, url: "*://*.archiveofourown.org/*" });
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
