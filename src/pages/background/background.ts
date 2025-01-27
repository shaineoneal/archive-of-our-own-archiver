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
    [MessageName.CheckLogin]: async (): Promise<MessageResponse<{ status: boolean }>> => {
        log('checkLogin message received');
        const { setAccessToken } = SyncUserStore.getState().actions;
        let syncUser = SyncUserStore.getState().user;
        log('syncUser', syncUser);
        if (syncUser.isLoggedIn && syncUser.accessToken) {
            log('user is logged in');
            setStore('user', syncUser, StoreMethod.SESSION);
            const isValid = await isAccessTokenValid(syncUser.accessToken);
            log('is access token valid', isValid);
            if (!isValid) {
                log('access token is not valid');
                if (syncUser.refreshToken) {
                    try {
                        const newAccessToken = await exchangeRefreshForAccessToken(syncUser.refreshToken);
                        log('newAccessToken', newAccessToken);
                        if (newAccessToken) {
                            setAccessToken(newAccessToken);
                            await setAccessTokenCookie(newAccessToken);
                            log('newAccessToken set');
                            return { response: { status: true } };
                        } else {
                            log('Error exchanging refresh token for access token');
                            return { response: { status: false } };
                        }
                    } catch (error) {
                        log('Error exchanging refresh token for access token', error);
                        return { response: { status: false } };
                    }
                } else {
                    return { response: { status: false } };
                }
            } else {
                setAccessToken(isValid);
                await setAccessTokenCookie(isValid);
                log('newAccessToken set');
                return { response: { status: true } };
            }
        } else {
            return { response: { status: false } };
        }
    },
    [MessageName.AddWorkToSheet]: async (payload): Promise<MessageResponse<User_BaseWork>> => {
        let sessionUser = SyncUserStore.getState().user;
        log('payload', payload);
        if (sessionUser.spreadsheetId !== undefined && sessionUser.accessToken !== undefined) {
            const work = await addWorkToSheet(sessionUser.spreadsheetId, sessionUser.accessToken, payload.work);
            setStore(`${payload.work.workId}`, work, StoreMethod.SESSION);
            return { response: work };
        } else {
            log(payload);
            throw new Error('no spreadsheetId or accessToken');
        }
    },
    [MessageName.RemoveWorkFromSheet]: async (payload): Promise<MessageResponse<boolean>> => {
        log('payload', payload);
        let sessionUser = SyncUserStore.getState().user;
        const workId = `${payload.workId}`;
        log('workId', workId);
        const work = await getStore(workId, StoreMethod.SESSION);
        const workIndex = work[workId].index;
        log('workIndex', workIndex);
        if (sessionUser.spreadsheetId !== undefined && sessionUser.accessToken !== undefined) {
            const resp = await removeWorkFromSheet(sessionUser.spreadsheetId, sessionUser.accessToken, workIndex);
            if (resp) {
                log('work removed from sheet');
                removeStore(workId, StoreMethod.SESSION);
                return { response: true };
            } else {
                return { response: false };
            }
        } else {
            log(payload);
            log('sessionUser', sessionUser);
            return { response: false };
        }
    },
    [MessageName.RefreshAccessToken]: async (): Promise<MessageResponse<string>> => {
        let syncUser = SyncUserStore.getState().user;
        const { setAccessToken } = SyncUserStore.getState().actions;
        log('refreshAccessToken message received', 'syncUser', syncUser);
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
                    return { response: accessToken };
                } else {

                    return { response: '' };
                }
            } catch (error) {
                log('Error exchanging refresh token for access token\n', error);
                return { response: '' };
            }
        } else {
            return { response: '' };
        }
    },
    [MessageName.UpdateWorkInSheet]: async (payload): Promise<MessageResponse<boolean>> => {
        log('payload', payload);
        let sessionUser = SyncUserStore.getState().user;
        log('sessionUser', sessionUser);
        if (sessionUser.spreadsheetId !== undefined && sessionUser.accessToken !== undefined) {
            const resp = await updateWorkInSheet(sessionUser.spreadsheetId, sessionUser.accessToken, payload.work);
            if (resp) {
                log('work updated in sheet');
                setStore(`${payload.work.workId}`, payload.work, StoreMethod.SESSION);
                return { response: true };
            } else {
                log('work not updated in sheet');
                return { response: false };
            }
        } else {
            log(payload);
            log('sessionUser', sessionUser);
            return { response: false };
        }
    },
    [MessageName.QuerySpreadsheet]: async (msg): Promise<MessageResponse<boolean[]>> => {
        let syncUser = SyncUserStore.getState().user;
        const { setAccessToken } = SessionUserStore.getState().actions;

        if (syncUser.spreadsheetId === undefined || syncUser.accessToken === undefined) {
            throw new Error('no spreadsheetId or accessToken');
        }

        log('querySheet message received');
        let responseArray: boolean[] = [];
        return querySpreadsheet(syncUser.spreadsheetId, syncUser.accessToken, msg.list).then((response) => {
            log('querySheet response', response);
            log('response.table.rows', response.table.rows);

            //save the response to the session store
            for (let row of response.table.rows) {
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
            }

            responseArray = compareArrays(msg.list, response.table.rows);
            log('responseArray', responseArray);
            return { response: responseArray };
        }).catch((error) => {
            throw new Error(error);
        });
    }
});