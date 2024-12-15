import log from '../../utils/logger';
import { SessionUserStore, SyncUserStore } from "../../utils/zustand";
import {
    addWorkToSheet,
    createMessageHandlers,
    exchangeRefreshForAccessToken,
    MessageName,
    querySpreadsheet,
    setStore,
    StoreMethod
} from "../../utils/chrome-services";
import { compareArrays } from "../../utils/compareArrays";
import { User_BaseWork } from "../content-script/User_BaseWork";
import { forEach } from "remeda";
import session = chrome.storage.session;

chrome.runtime.onConnect.addListener((port) => {
    log('background script running');

    let syncUser = SyncUserStore.getState().user;
    const {setAccessToken} = SyncUserStore.getState().actions;
    log('syncUser from onMessage', syncUser);

    chrome.storage.session.setAccessLevel({accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS'})
        .then(() => {
            log('access level set');
        });
});

createMessageHandlers({
    [MessageName.CheckLogin]: async (payload) => {
        log('checkLogin message received', payload);
        let syncUser = SyncUserStore.getState().user;
        if(syncUser.isLoggedIn) {
            log('user is logged in');
            //save user to session storage
            setStore('user', syncUser, StoreMethod.SESSION);
            return { status: true } ;
        } else return { status: false } ;
    },
    [MessageName.QuerySpreadsheet]: async (msg) => {
        let syncUser = SyncUserStore.getState().user;
        const { setAccessToken } = SessionUserStore.getState().actions;

        if (syncUser.spreadsheetId === undefined || syncUser.accessToken === undefined) {
            throw new Error('no spreadsheetId or accessToken');
        }
        //let syncUser = SyncUserStore.getState().user;
        log('querySheet message received');
        let responseArray: boolean[] = [];
        return querySpreadsheet(syncUser.spreadsheetId, syncUser.accessToken, msg.list).then((response) => {
            log('querySheet response', response);

            if (response.status && response.status === "error") {
                log('querySheet error', response.error);
                //TODO: clean this mess
                if (syncUser.refreshToken != null) {
                    exchangeRefreshForAccessToken(syncUser.refreshToken).then((newAccessToken) => {
                        log('newAccessToken', newAccessToken);
                        if (newAccessToken) {
                            chrome.storage.session.set({accessToken: newAccessToken}).then(() => {
                                log('newAccessToken set');
                                setAccessToken(newAccessToken);

                                if (syncUser.spreadsheetId != null) {
                                    querySpreadsheet(syncUser.spreadsheetId, newAccessToken, msg.list).then((response) => {
                                        log('querySheet response', response);
                                        const responseArray = compareArrays(msg.list, response.table.rows);
                                        log('responseArray', responseArray);
                                        return responseArray;

                                    });
                                }
                            });
                        }
                    });
                }
                return response.error;
            }

            forEach(response.table.rows, (row) => {
                log('row', row);

                let status = row.c[1] ? row.c[1].v : 'read';
                let history = row.c[2] ? row.c[2].v : '';
                let personalTags = row.c[3] ? row.c[3].v.split(',') : [];
                let rating = row.c[4] ? row.c[4].v : 0;
                let readCount = row.c[5] ? row.c[5].v : 1;
                let skipReason = row.c[6] ? row.c[6].v : '';

                let work = new User_BaseWork(row.c[0].v, status, history, personalTags, rating, readCount, skipReason);

                chrome.storage.session.set({[row.c[0].v]: work}).then(r =>
                    log('set session storage', r)
                );
            });

            responseArray = compareArrays(msg.list, response.table.rows);
            log('responseArray', responseArray);
            log('responseArray type', typeof responseArray);
            return responseArray;
        }).catch((error) => {
            throw new Error(error);
        });
    },
    [MessageName.AddWorkToSheet]: async (payload) => {
        let sessionUser = SyncUserStore.getState().user;
        if (sessionUser.spreadsheetId !== undefined && sessionUser.accessToken !== undefined) {
            return await addWorkToSheet(sessionUser.spreadsheetId, sessionUser.accessToken, payload.work);

        } else {
            log(payload)
            log('sessionUser', sessionUser);
            return false;
        }
        //await querySpreadsheet(syncUser.spreadsheetId, syncUser.accessToken, payload.list).then((response) => {
        //    response.table.rows.forEach((row) => {
        //        log('row', row);
//
        //        let status = row.c[1] ? row.c[1].v : 'read';
        //        let history = row.c[2] ? row.c[2].v : '';
        //        let personalTags = row.c[3] ? row.c[3].v.split(',') : [];
        //        let rating = row.c[4] ? row.c[4].v : 0;
        //        let readCount = row.c[5] ? row.c[5].v : 1;
        //        let skipReason = row.c[6] ? row.c[6].v : '';
//
        //        let work = new User_BaseWork(row.c[0].v, status, history, personalTags, rating, readCount, skipReason);
//
        //        chrome.storage.session.set({[row.c[0].v]: work}).then(r =>
        //            log('set session storage', r)
        //        );
        //    });
//
        //    const responseArray = compareArrays(payload.list, response.table.rows);
        //    log('responseArray', responseArray);
        //    return responseArray;
        //}).catch((error) => {
        //    throw new Error(error);
        //});
    }//
});




    //receiveMessage(port, MessageName.CheckLogin, async (payload) => {
    //    log('checkLogin message received', payload);
    //    if(syncUser.isLoggedIn) {
    //        log('user is logged in');
    //        chrome.storage.session.set({ user: syncUser }).then(() => {
    //            log('sessUser set');
    //        });
    //        return { isLoggedIn: true };
    //    } else return { isLoggedIn: false };
    //});

    /*port.onMessage.addListener((msg) => {

//TODO: change to outer check for user and handle accordingly


        if (msg.message === 'addWorkToSheet') {
            if (syncUser.spreadsheetId === undefined || syncUser.accessToken === undefined) {
                return;
            }
            log('addWorkToSheet message received');
            addWorkToSheet(syncUser.spreadsheetId, syncUser.accessToken, msg.work).then((response) => {
                log('sending response', response);
                port.postMessage({response: response});
            });
            return true;
            //getLocalAccessToken().then((token) => {
            //    log('token', token);
            //    fetchSpreadsheetUrl().then((spreadsheetUrl) => {
            //        addWorkToSheet(spreadsheetUrl, token, msg.work).then((response) => {
            //            log('response', response);
            //            port.postMessage({ response: response });
            //        });
            //    });
            //});
        } else if (msg.message === 'querySpreadsheet') {
            if (syncUser.spreadsheetId === undefined || syncUser.accessToken === undefined) {
                return;
            }
            log('querySheet message received');
            querySpreadsheet(syncUser.spreadsheetId, syncUser.accessToken, msg.list).then((response) => {
                log('querySheet response', response);

                if (response.status && response.status === "error") {
                    log('querySheet error', response.error);
                    //TODO: clean this mess
                    if (syncUser.refreshToken != null) {
                        exchangeRefreshForAccessToken(syncUser.refreshToken).then((newAccessToken) => {
                            log('newAccessToken', newAccessToken);
                            if (newAccessToken) {
                                chrome.storage.session.set({accessToken: newAccessToken}).then(() => {
                                    log('newAccessToken set');
                                    setAccessToken(newAccessToken);

                                    if (syncUser.spreadsheetId != null) {
                                        querySpreadsheet(syncUser.spreadsheetId, newAccessToken, msg.list).then((response) => {
                                            log('querySheet response', response);
                                            const responseArray = compareArrays(msg.list, response.table.rows);
                                            log('responseArray', responseArray);
                                            port.postMessage({response: responseArray});

                                        });
                                    }
                                });
                            }
                        });
                    }
                    port.postMessage({response: response.error});
                    return;
                }

                forEach(response.table.rows, (row) => {
                    log('row', row);

                    let status = row.c[1] ? row.c[1].v : 'read';
                    let history = row.c[2] ? row.c[2].v : '';
                    let personalTags = row.c[3] ? row.c[3].v.split(',') : [];
                    let rating = row.c[4] ? row.c[4].v : 0;
                    let readCount = row.c[5] ? row.c[5].v : 1;
                    let skipReason = row.c[6] ? row.c[6].v : '';

                    let work = new User_BaseWork(row.c[0].v, status, history, personalTags, rating, readCount, skipReason);

                    chrome.storage.session.set({[row.c[0].v]: work}).then(r =>
                        log('set session storage', r)
                    );
                });

                const responseArray = compareArrays(msg.list, response.table.rows);
                log('responseArray', responseArray);
                port.postMessage({response: responseArray});
            });
            return true;
        }
        return true;
    });
});*/

//receiveMessage(
//    MessageName.AddWorkToSheet,
//    async (payload): Promise<boolean> => {
//        let syncUser = SyncUserStore.getState().user;
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
//        let sessionUser = SyncUserStore.getState().user;
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
//    let syncUser = SyncUserStore.getState().user;
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
    chrome.runtime.onMessage.addListener((isLoaded, sender, port.postMessage) => {
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
