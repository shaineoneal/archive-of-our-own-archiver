import { handleTokenExchange, main as bgMain } from "./background.ts";
import {
    isAccessTokenValid,
    sendMessage,
    onMessage,
    querySpreadsheet,
    addWorkToSheet,
    setStore, StoreMethod, getValidAccessToken
} from "@/utils/browser-services";
import { MessageResponse } from "@/utils/types/MessageResponse";
import { SyncUserStore } from "@/utils/zustand";
import { setAccessTokenCookie } from "@/utils/browser-services/cookies.ts";
import { User_BaseWork } from "@/entrypoints/content";

export default defineBackground(() => {
    log('background script running');

    browser.storage.session.setAccessLevel({accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS'})
        .then(() => {
            log('access level set');
        });

    onMessage('CheckLogin', async () => {
        // Called when the popup is opened
        log('CheckLogin message received');
        const {setAccessToken} = SyncUserStore.getState().actions;
        let syncUser = SyncUserStore.getState().user;

        log('syncUser', syncUser);
        if (syncUser.isLoggedIn && syncUser.refreshToken) {
            log('user is logged in');
            //setStore('user', syncUser, StoreMethod.SYNC);
            try {
                if (syncUser.accessToken === undefined) {
                    log('no access token');
                    return await handleTokenExchange<boolean>(syncUser.refreshToken);
                }
                const isValid = await isAccessTokenValid(syncUser.accessToken);
                log('is access token valid', isValid);
                if (isValid) {
                    setAccessToken(syncUser.accessToken);
                    await setAccessTokenCookie(syncUser.accessToken);
                    log('newAccessToken set');
                    return true;
                } else {
                    log('access token is not valid');
                    return await handleTokenExchange<boolean>(syncUser.refreshToken);
                }
            } catch (error) {
                log(error);
                return false;
            }
        } else {
            log(syncUser.refreshToken ? 'user is not logged in' : 'no refresh token found');
            return false;
        }
    });
    onMessage('QuerySpreadSheet', async (msg) => {
        let syncUser = SyncUserStore.getState().user;
        log('syncUser', syncUser);
        const {setAccessToken} = SyncUserStore.getState().actions;

        if (syncUser.spreadsheetId === undefined || syncUser.accessToken === undefined) {
            throw new Error('no spreadsheetId or accessToken');
        }

        log('querySheet message received: ', msg.data);
        let responseArray: User_BaseWork[] = [];
        try {
            const response = await querySpreadsheet(syncUser.spreadsheetId, syncUser.accessToken, msg.data);
            log('querySheet response', response);
            //log('response.table.rows', response.table.rows);

            let responseArray: boolean[] = [];
            if(response.table.rows && response.table.rows.length > 0) {
                log('response.table.rows', response.table.rows);
                //save the response to the session store
                for (let row of response.table.rows) {
                    let index = row.c[0].v ? row.c[0].v : 0;
                    let workId = row.c[1].v ? row.c[1].v : '';
                    let status = row.c[2] ? row.c[2].v : 'read';
                    let history = row.c[3] ? row.c[3].v : '';
                    let personalTags = row.c[4] ? row.c[4].v.split(',') : [];
                    let rating = row.c[5] ? row.c[5].v : 0;
                    let readCount = row.c[6] ? row.c[6].v : 1;
                    let skipReason = row.c[7] ? row.c[7].v : undefined;
                    log('row', index, status, history, personalTags, rating, readCount, skipReason);
                    let work = { workId, index, status, history, personalTags, rating, readCount, skipReason };
                    //responseArray.push(work);
                    setStore(`${workId}`, work, StoreMethod.SESSION);
                    //browser.storage.session.set({workId: work}).then(r => log('set session storage', r));
                }
                responseArray = compareArrays(msg.data, response.table.rows);
            }
        
//
          
            log('responseArray', responseArray);
            return responseArray;
        } catch (error: any) {
            throw new Error(error);
        }
    });
    onMessage('AddWorkToSpreadsheet', async (msg) => {
        let sessionUser = SyncUserStore.getState().user;
        
             log('payload', msg);
             if (sessionUser.spreadsheetId !== undefined && sessionUser.accessToken !== undefined) {
                 try {
                     const work = await addWorkToSheet(sessionUser.spreadsheetId, sessionUser.accessToken, msg.data);
                     setStore(`${msg.data.workId}`, work, StoreMethod.SESSION);
                     return work;
                 } catch (error) {
                     log('error adding work to sheet', error);
                     // if user has a refresh token, try to get a new access token
                     if (sessionUser.refreshToken) {
                         let accessT = await getValidAccessToken(sessionUser.accessToken, sessionUser.refreshToken);
                         if (accessT) {
                             sessionUser.accessToken = accessT;
                             setStore('user', sessionUser, StoreMethod.SYNC);
                             return await handleTokenExchange<User_BaseWork>(sessionUser.refreshToken);
                         }
                     }
                     throw new Error('access token expired or invalid, and there was an error exchanging the refresh token');
                 }
             } else {
                 log(msg);
                 throw new Error('no spreadsetId or accessToken');
             }

    });
});
