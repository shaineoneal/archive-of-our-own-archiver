import { log } from '../../utils/logger';
import { SessionUserStore, SyncUserStore } from "../../utils/zustand";
import {
    addWorkToSheet,
    createMessageHandlers,
    exchangeRefreshForAccessToken, getStore, isAccessTokenValid,
    MessageName,
    querySpreadsheet, removeStore,
    setStore,
    StoreMethod,
} from "../../utils/chrome-services";
import { compareArrays } from "../../utils/compareArrays";
import { User_BaseWork } from "../content-script/User_BaseWork";
import { MessageResponse } from "../../utils/types/MessageResponse"; // Ensure this import is present
import session = chrome.storage.session;
import { removeWorkFromSheet } from "../../utils/chrome-services/removeWorkFromSheet";
import { updateWorkInSheet } from "../../utils/chrome-services/updateWorkInSheet";
import { setAccessTokenCookie } from "../../utils/chrome-services/cookies";

chrome.runtime.onConnect.addListener((port) => {
    log('background script running');

    chrome.storage.session.setAccessLevel({accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS'})
        .then(() => {
            log('access level set');
        });
});

createMessageHandlers({
    // Called when the popup is opened
    [MessageName.CheckLogin]: async () => {
        log('checkLogin message received');
        const { setAccessToken } = SyncUserStore.getState().actions;
        let syncUser = SyncUserStore.getState().user;
        log('syncUser', syncUser);
        if(syncUser.isLoggedIn && syncUser.accessToken) {
            log('user is logged in');
            // save user to session storage0.
            setStore('user', syncUser, StoreMethod.SESSION);
            // is access token valid?
            const isValid = await isAccessTokenValid(syncUser.accessToken)
            log('is access token valid', isValid);
            if(!isValid) {
                log('access token is not valid');
                if (syncUser.refreshToken) {
                    try {
                        const newAccessToken = await exchangeRefreshForAccessToken(syncUser.refreshToken);
                        log('newAccessToken', newAccessToken);
                        if (newAccessToken) {
                            setAccessToken(newAccessToken);
                            await setAccessTokenCookie(newAccessToken);
                            log('newAccessToken set');
                        } else {
                            log('Error exchanging refresh token for access token');
                        }
                    } catch (error) {
                        log('Error exchanging refresh token for access token', error);
                    }
                }
            } else {
                setAccessToken(isValid);
                await setAccessTokenCookie(isValid);
                log('newAccessToken set');
            }
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
            log('querySheet # rows', response.table.rows.length);
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

            forEach(response.table.rows, (row) => {
                log('row', row);

                let index = row.c[0].v ? row.c[0].v : 0;
                let status = row.c[2] ? row.c[2].v : 'read';
                let history = row.c[3] ? row.c[3].v : '';
                let personalTags = row.c[4] ? row.c[4].v.split(',') : [];
                let rating = row.c[5] ? row.c[5].v : 0;
                let readCount = row.c[6] ? row.c[6].v : 1;
                let skipReason = row.c[7] ? row.c[7].v : '';

                let work = new User_BaseWork(row.c[1].v, index, status, history, personalTags, rating, readCount, skipReason);

                chrome.storage.session.set({[row.c[1].v]: work}).then(r =>
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
        log('payload', payload);
        if (sessionUser.spreadsheetId !== undefined && sessionUser.accessToken !== undefined) {
            const work =  await addWorkToSheet(sessionUser.spreadsheetId, sessionUser.accessToken, payload.work);
            setStore(`${payload.work.workId}`, work, StoreMethod.SESSION);
            return work;

        } else {
            log(payload)
            log('sessionUser', sessionUser);
            throw new Error('no spreadsheetId or accessToken');
            //TODO: handle this better
        }
    },
    [MessageName.RemoveWorkFromSheet]: async (payload) => {
        log('payload', payload);
        let sessionUser = SyncUserStore.getState().user;
        const workId = `${payload.workId}`;
        log('workId', workId);
        const work = await getStore(workId, StoreMethod.SESSION);
        const workIndex = work[workId].index;
        log('workIndex', workIndex);
        if (sessionUser.spreadsheetId !== undefined && sessionUser.accessToken !== undefined) {
            const resp = await removeWorkFromSheet(sessionUser.spreadsheetId, sessionUser.accessToken, workIndex);
            //TODO: fix this
            //if (resp) {
            //    log('work removed from sheet');
            //    removeStore(workId, StoreMethod.SESSION);
            //    return true;
            //} else return false;
            return false;
        } else {
            log(payload)
            log('sessionUser', sessionUser);
            return false;
        }
    },
    [MessageName.RefreshAccessToken]: async () => {
        let syncUser = SyncUserStore.getState().user;
        const { setAccessToken } = SyncUserStore.getState().actions;
        log('refreshAccessToken message received');
        if (syncUser.refreshToken) {
            try {
                const accessToken = await exchangeRefreshForAccessToken(syncUser.refreshToken);
                log('accessToken', accessToken);
                if (accessToken) {
                    if (await isAccessTokenValid(accessToken)) {
                        log('accessToken is valid');
                        await setAccessTokenCookie(accessToken);
                        setAccessToken(accessToken);
                    }
                    return accessToken;
                }
                else return 'testing';
            } catch (error) {
                log('Error exchanging refresh token for access token', error);
                return '';
            }
        } else return '';
    },
    [MessageName.UpdateWorkInSheet]: async (payload) => {
        log('payload', payload);
        let sessionUser = SyncUserStore.getState().user;
        log('sessionUser', sessionUser);
        if (sessionUser.spreadsheetId !== undefined && sessionUser.accessToken !== undefined) {
            const resp =  await updateWorkInSheet(sessionUser.spreadsheetId, sessionUser.accessToken, payload.work);
            if(resp) {
                log('work updated in sheet');
                setStore(`${payload.work.workId}`, payload.work, StoreMethod.SESSION);
                return true;
            } else {
                log('work not updated in sheet');
                return false;
            }
        } else return false;

    }
});

//TODO: this forces a lot of reloads, make calls to refresh the page instead
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

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    log('background', 'heard message: ', message);
    let syncUser = SyncUserStore.getState().user;
    const {setAccessToken} = SyncUserStore.getState().actions;
    log('refreshAccessToken message received');
    if (syncUser.refreshToken) {
        try {
            const accessToken = await exchangeRefreshForAccessToken(syncUser.refreshToken);
            log('accessToken', accessToken);
            if (accessToken) {
                if (await isAccessTokenValid(accessToken)) {
                    log('accessToken is valid');
                    await setAccessTokenCookie(accessToken);
                    setAccessToken(accessToken);
                }
                sendResponse(accessToken);
            } else return 'testing';
        } catch (error) {
            log('Error exchanging refresh token for access token', error);
            return '';
        }
    } else return '';
});