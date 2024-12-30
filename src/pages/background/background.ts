import log from '../../utils/logger';
import { SessionUserStore, SyncUserStore, useActions, useUser } from "../../utils/zustand";
import {
    addWorkToSheet,
    createMessageHandlers,
    exchangeRefreshForAccessToken, isAccessTokenValid,
    MessageName,
    querySpreadsheet,
    setStore,
    StoreMethod
} from "../../utils/chrome-services";
import { compareArrays } from "../../utils/compareArrays";
import { User_BaseWork } from "../content-script/User_BaseWork";
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
            log('querySheet error', response.table.rows.length);
            if (response.table.rows.length == 0) {
                log('no rows');
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

            response.table.rows.forEach((row) => {
                log('row', row);

                let status = row.c[1] ? row.c[1].v : 'read';
                let history = row.c[2] ? row.c[2].v : '';
                let personalTags = row.c[3] ? row.c[3].v.split(',') : [];
                let rating = row.c[4] ? row.c[4].v : 0;
                let readCount = row.c[5] ? row.c[5].v : 1;
                let skipReason = row.c[6] ? row.c[6].v : '';

                let work = new User_BaseWork(row.c[0].v, status, history, personalTags, rating, readCount, skipReason);

                chrome.storage.session.set({[row.c[0].v]: work}).then(r =>
                    log('added work to session storage', r)
                );
            });

            responseArray = compareArrays(msg.list, response.table.rows);
            log('responseArray', responseArray);
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
    },
    [MessageName.GetCurrentTab]: async (payload) => {
            let queryOptions = { active: true, lastFocusedWindow: true };
            // `tab` will either be a `tabs.Tab` instance or `undefined`.
            let [tab] = await chrome.tabs.query(queryOptions);
            if (!tab.url) {
                return 'no tab';
            }
            return tab.url;
    },
    [MessageName.TabVisible]: async (payload) => {
        log('tabVisible message received', payload);
        let user = SyncUserStore.getState().user;
        const {setAccessToken} = SyncUserStore.getState().actions;
        log('user', user);
        // if user has access token, check if it's valid
        if(user.accessToken !== undefined) {
            log('user has access token');
            isAccessTokenValid(user.accessToken).then(() => {
                log('access token is valid');
                return true;
            }).catch(async (error) => {
                log('access token is invalid');
                // If there is an error, exchange the refresh token for an access token
                if (user.refreshToken) {
                    const newAccessToken = await exchangeRefreshForAccessToken(user.refreshToken);
                    chrome.runtime.reload();
                    chrome.tabs.query({ url: "*://*.archiveofourown.org/*" }, (tabs) => {
                        tabs.forEach((tab) => {
                            chrome.tabs.reload(tab.id!).then(r => log('reloaded tab', r));
                        });
                    });
                    return (newAccessToken !== undefined);
                } else {
                    log('User does not have a refresh token:');
                    // If the user does not have a refresh token, log them out
                    setAccessToken(undefined);
                    return false;
                }
            });
        } else {
            log('user does not have access token');
            return false;
        }
        return (user.accessToken !== undefined);
    }
});

chrome.storage.onChanged.addListener((changes) => {
    log('storage changed', changes);
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
    }
});
