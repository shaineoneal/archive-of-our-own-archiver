import { SessionUserStore, SyncUserStore } from "@/utils/zustand";
import {
    addWorkToSheet,
    exchangeRefreshForAccessToken, getStore, getValidAccessToken, isAccessTokenValid,
    querySpreadsheet, removeStore,
    setStore,
    StoreMethod,
} from "@/utils/browser-services";
import { compareArrays } from "@/utils/compareArrays.ts";
import { User_BaseWork } from "@/entrypoints/content";
import { MessageResponse } from "@/utils/types/MessageResponse"; // Ensure this import is present
import { removeWorkFromSheet } from "@/utils/browser-services/removeWorkFromSheet.ts";
import { updateWorkInSheet } from "@/utils/browser-services/updateWorkInSheet.tsx";
import { setAccessTokenCookie } from "@/utils/browser-services/cookies.ts";

let syncUser = SyncUserStore.getState().user;

export async function handleTokenExchange<T>(refreshToken: string): Promise<T> {
    const {setAccessToken} = SyncUserStore.getState().actions;
    try {
        const newAccessToken = await exchangeRefreshForAccessToken(refreshToken);
        log('newAccessToken', newAccessToken);
        if (newAccessToken) {
            setAccessToken(newAccessToken);
            await setAccessTokenCookie(newAccessToken);
            log('newAccessToken set');
            return true as unknown as T;
        } else {
            log('Error exchanging refresh token for access token');
            return false as unknown as T;
        }
    } catch (error) {
        log('Error exchanging refresh token for access token', error);
        return false as unknown as T;
    }
}

export function main() {

    /* createMessageHandlers({
         // Called when the popup is opened
         [MessageName.CheckLogin]: async (): Promise<MessageResponse<boolean>> => {
             log('CheckLogin message received');
             const {setAccessToken} = SyncUserStore.getState().actions;
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
                         return {response: true};
                     } else {
                         log('access token is not valid');
                         return await handleTokenExchange<boolean>(syncUser.refreshToken);
                     }

                 } catch (error) {
                     log(error);
                     return {response: false};
                 }
             } else {
                 log('user is not logged in');
                 return {response: false};
             }
         },
         [MessageName.AddWorkToSheet]: async (payload): Promise<MessageResponse<User_BaseWork>> => {
             let sessionUser = SyncUserStore.getState().user;
             log('payload', payload);
             if (sessionUser.spreadsheetId !== undefined && sessionUser.accessToken !== undefined) {
                 try {
                     const work = await addWorkToSheet(sessionUser.spreadsheetId, sessionUser.accessToken, payload.work);
                     setStore(`${payload.work.workId}`, work, StoreMethod.SESSION);
                     return {response: work};
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
                 log(payload);
                 throw new Error('no spreadsetId or accessToken');
             }
         },
         /*[MessageName.RemoveWorkFromSheet]: async (payload): Promise<MessageResponse<boolean>> => {
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
                     return {response: true};
                 } else {
                     return {response: false};
                 }
             } else {
                 log(payload);
                 log('sessionUser', sessionUser);
                 return {response: false};
             }
         },
         [MessageName.RefreshAccessToken]: async (): Promise<MessageResponse<string>> => {
             let syncUser = SyncUserStore.getState().user;
             log('refreshAccessToken message received', 'syncUser', syncUser);
             if (syncUser.refreshToken) {
                 return await handleTokenExchange<string>(syncUser.refreshToken);
             } else {
                 return {response: ''};
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
                     return {response: true};
                 } else {
                     log('work not updated in sheet');
                     return {response: false};
                 }
             } else {
                 log(payload);
                 log('sessionUser', sessionUser);
                 return {response: false};
             }
         },
         [MessageName.QuerySpreadsheet]: async (msg): Promise<MessageResponse<boolean[]>> => {
             let syncUser = SyncUserStore.getState().user;
             const {setAccessToken} = SessionUserStore.getState().actions;

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
                 return {response: responseArray};
             }).catch((error) => {
                 throw new Error(error);
             });
        }
    });*/

}