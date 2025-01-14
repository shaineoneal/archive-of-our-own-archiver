import log from '../../utils/logger';
import { SessionUserStore, SyncUserStore } from "../../utils/zustand";
import {
    addWorkToSheet,
    createMessageHandlers,
    exchangeRefreshForAccessToken, getStore,
    MessageName,
    querySpreadsheet,
    setStore,
    StoreMethod,
} from "../../utils/chrome-services";
import { compareArrays } from "../../utils/compareArrays";
import { User_BaseWork } from "../content-script/User_BaseWork";
import { forEach } from "remeda";
import session = chrome.storage.session;
import { removeWorkFromSheet } from "../../utils/chrome-services/removeWorkFromSheet";

chrome.runtime.onConnect.addListener((port) => {
    log('background script running');

    chrome.storage.session.setAccessLevel({accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS'})
        .then(() => {
            log('access level set');
        });
});

createMessageHandlers({
    [MessageName.CheckLogin]: async () => {
        log('checkLogin message received');
        let syncUser = SyncUserStore.getState().user;
        log('syncUser', syncUser);
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

                let work = new User_BaseWork(index, row.c[1].v, status, history, personalTags, rating, readCount, skipReason);

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
        if (sessionUser.spreadsheetId !== undefined && sessionUser.accessToken !== undefined) {
            return await addWorkToSheet(sessionUser.spreadsheetId, sessionUser.accessToken, payload.work);

        } else {
            log(payload)
            log('sessionUser', sessionUser);
            return false;
        }
    },
    [MessageName.RemoveWorkFromSheet]: async (payload) => {
        let sessionUser = SyncUserStore.getState().user;
        const workId = `${payload.workId}`;
        const work = await getStore(workId, StoreMethod.SESSION);
        const workIndex = work[workId].index;
        if (sessionUser.spreadsheetId !== undefined && sessionUser.accessToken !== undefined) {
           // return await removeWorkFromSheet(sessionUser.spreadsheetId, sessionUser.accessToken, workIndex);

        } else {
            log(payload)
            log('sessionUser', sessionUser);
            return false;
        }
    }
});

chrome.storage.onChanged.addListener((changes) => {
    log('storage changed', changes);
    if( changes['user-store'] ) {
        log('user changed', changes['user-store']);
        chrome.tabs.query({ url: "*://*.archiveofourown.org/*" }, (tabs) => {
            tabs.forEach((tab) => {
                log('sending message to tab', tab);
                //chrome.tabs.sendMessage(tab.id!, {message: "userChanged", newUser: changes['user-store'].newValue})
                //    .then((response) => {
                        //chrome.runtime.reload();
                        //chrome.tabs.reload(tab.id!).then(r => log('reloaded tab', r));
                //        log('response from content script', response)
                //    });

            });
        });
    }
});
