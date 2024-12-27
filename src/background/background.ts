import { get } from 'jquery';
import { addWorkToSheet, fetchSpreadsheetUrl, getSavedToken } from '../chrome-services';
import { listQuery, workQuery } from '../chrome-services/querySheet';
import { launchWebAuthFlow } from '../chrome-services/utils/oauthSignIn';
import { compareArrays } from '../utils/compareArrays';
import { log } from '../utils/logger';

//window.alert('background script loaded');

chrome.runtime.onConnect.addListener(function (port) {
    port.onMessage.addListener(function (msg) {
        log('port message', msg);
        if (msg.message === 'getAuthToken') {
            log('getAuthToken message recieved');
            getSavedToken().then((token) => {
                log('port token', token);
                port.postMessage({ token: token });
            }).catch(() => {
                log('port token', 'none');
                chrome.scripting.executeScript({
                    target: { tabId: port.sender?.tab?.id || 0 },
                    func: ()    => {
                        return window.confirm('You need an auth token! Log back in?');
                    }
                }).then((response) => {
                    log('im a genius', response);
                    if (response[0].result) {
                        launchWebAuthFlow(true).then((cookie) => {
                            log('cookie', cookie);
                            chrome.runtime.reload();
                            chrome.scripting.executeScript({
                                target: { tabId: port.sender?.tab?.id || 0 },
                                func: () => {
                                   window.location.reload();
                                }
                            });
                        });
                    } else {
                        port.postMessage({ error: 'User not logged in' });
                    }
                });
            });
        } else if (msg.message === 'fetchSpreadsheetUrl') {
            log('fetchSpreadsheetUrl message recieved');
            fetchSpreadsheetUrl().then((spreadsheetUrl) => {
                log('port spreadsheetUrl', spreadsheetUrl);
                port.postMessage({ spreadsheetUrl: spreadsheetUrl });
            });
        } else if (msg.message === 'querySheet') {
            log('querySheet message received, payload: ', msg);
            if(msg.list) {

                getSavedToken().then((token) => {
                    log('token', token);
                    fetchSpreadsheetUrl().then((spreadsheetUrl) => {
                        listQuery(spreadsheetUrl, token, msg.list).then((response) => {
                            log('response', response);
                            const responseArray = compareArrays(msg.list, response.table.rows);
                            port.postMessage({reason: 'listQuerySheet', response: responseArray});
                        });
                    });
                }).catch((error) => {
                    log('error', error);
                    port.postMessage({reason: 'listQuerySheet', response: error});
                });
            } else if (msg.work) {
                log('single work querySheet message received');
                getSavedToken().then((token) => {
                    log('token', token);
                    fetchSpreadsheetUrl().then((spreadsheetUrl) => {
                        workQuery(spreadsheetUrl, token, msg.work).then((response) => {
                            log('response', response);
                            port.postMessage({reason: 'workQuerySheet', response: response});
                        });
                    });
                }).catch((error) => {
                    log('error', error);
                    port.postMessage({reason: 'workQuerySheet', response: error});
                });
            }


        } else if (msg.message === 'sendLoginNotification') {
            log('sendLoginNotification message recieved');
            
        }
    });
    port.onDisconnect.addListener(function () {
        log('port disconnected');
    });
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.message === 'addWorkToSheet') {
        log('addWorkToSheet message recieved');
        getSavedToken().then((token) => {
            log('token', token);
            fetchSpreadsheetUrl().then((spreadsheetUrl) => {
                addWorkToSheet(spreadsheetUrl, token, msg.work).then((response) => {
                    log('response', response);
                    sendResponse({ response: response });
                });
            });
        });
    }
});

chrome.storage.onChanged.addListener((changes) => {
    if(changes.spreadsheetUrl) {
        log('spreadsheetUrl changed', changes.spreadsheetUrl);
        chrome.runtime.sendMessage({ message: "spreadsheetUrlChanged", newUrl: changes.spreadsheetUrl.newValue });
    }
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
    const tabs = await chrome.tabs.listQuery({ active: true, currentWindow: true, url: "*://*.archiveofourown.org/*" });
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
