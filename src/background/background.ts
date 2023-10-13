import { addWorkToSheet, fetchSpreadsheetUrl, getSavedToken, removeWorkFromSheet } from '../chrome-services';
import { launchWebAuthFlow } from '../chrome-services/utils/oauthSignIn';
import { compareArrays } from '../utils/compareArrays';
import { log } from '../utils/logger';
import { addQuerySheet, getValsFromQuerySheet } from '../chrome-services/utils/createQuerySheet';

//window.alert('background script loaded');

chrome.scripting.registerContentScripts(
    [
        {
            id: "content_script",
            matches: ["https://archiveofourown.org/works/*"],
            js: ["./js/content_script.js"],
            css: ["./js/content_script.css"],
            runAt: "document_end"
        }
    ],
    () => {
        log('content script registered');
    }
);



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
                    func: () => {
                        window.confirm('You need an auth token! Log back in?');
                    }
                }).then((response) => {
                    log('im a genius', response);
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
                });
            });
        } else if (msg.message === 'fetchSpreadsheetUrl') {
            log('fetchSpreadsheetUrl message recieved');
            fetchSpreadsheetUrl().then((spreadsheetUrl) => {
                log('port spreadsheetUrl', spreadsheetUrl);
                port.postMessage({ spreadsheetUrl: spreadsheetUrl });
            });
        } else if (msg.message === 'querySheet') {
            log('querySheet message recieved');
            getSavedToken().then((token) => {
                log('token', token);
                fetchSpreadsheetUrl().then((spreadsheetUrl) => {
                    
                    addQuerySheet(spreadsheetUrl, token, msg.list).then((response: any) => {
                        log('response', response);
                        log('getVals', getValsFromQuerySheet(response));
                        let vals = getValsFromQuerySheet(response);

                        if (vals.rowNumber) { global.LASTROW = vals.rowNumber; }
                                         
                        const responseArray = compareArrays(msg.list, vals.workList);
                        port.postMessage({ reason: 'querySheet', response: responseArray });
                    });
                });
            }).catch((error) => {
                log('error', error);
                port.postMessage({ reason: 'querySheet', response: error });
            });
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
                addWorkToSheet(spreadsheetUrl, token, msg.work, global.LASTROW).then((response) => {
                    global.LASTROW++;
                    log('response', response);
                    sendResponse({ response: response });
                });
            });
        });
    } else if (msg.message === 'removeWorkFromSheet') {
        log('removeWorkFromSheet message recieved');
        getSavedToken().then((token) => {
            log('token', token);
            fetchSpreadsheetUrl().then((spreadsheetUrl) => {
                removeWorkFromSheet(spreadsheetUrl, token, msg.work).then((response) => {
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

