import { defineExtensionMessaging } from "@webext-core/messaging";
import { Ao3_BaseWork, User_BaseWork } from "@/entrypoints/content";
import { SyncUserStore } from "@/utils/zustand";
import {
    isAccessTokenValid,
    querySpreadsheet,
    addWorkToSheet,
    setAccessTokenCookie,
    getValidAccessToken,
    setStore,
    StoreMethod,
    handleTokenExchange
} from "@/utils/browser-services";


interface ProtocolMap {
    AddWorkToSpreadsheet(work: Ao3_BaseWork): User_BaseWork;
    CheckLogin(): boolean;
    LoggedIn(data: { accessToken: string, refreshToken: string }): void;
    QuerySpreadSheet(searchList: number[]): boolean[];
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();

export async function handleAddWorkToSpreadsheet(msg: { data: Ao3_BaseWork }): Promise<User_BaseWork> {
    let sessionUser = SyncUserStore.getState().user;

    if (sessionUser.spreadsheetId !== undefined && sessionUser.accessToken !== undefined) {
        try {
            const work = await addWorkToSheet(sessionUser.spreadsheetId, sessionUser.accessToken, msg.data);
            setStore(`${msg.data.workId}`, work, StoreMethod.SESSION);
            return work;
        } catch (error) {
            console.error('error adding work to sheet', error);
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
        throw new Error('no spreadsheetId or accessToken');
    }
}
export async function handleCheckLogin(): Promise<boolean> {
    const { setAccessToken } = SyncUserStore.getState().actions;
    let syncUser = SyncUserStore.getState().user;

    if (syncUser.isLoggedIn && syncUser.refreshToken) {
        try {
            if (syncUser.accessToken === undefined) {
                return await handleTokenExchange<boolean>(syncUser.refreshToken);
            }
            const isValid = await isAccessTokenValid(syncUser.accessToken);
            if (isValid) {
                setAccessToken(syncUser.accessToken);
                await setAccessTokenCookie(syncUser.accessToken);
                return true;
            } else {
                return await handleTokenExchange<boolean>(syncUser.refreshToken);
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    } else {
        return false;
    }
}

export async function handleQuerySpreadSheet(msg: { data: number[] }): Promise<boolean[]> {
    let syncUser = SyncUserStore.getState().user;
    const { setAccessToken } = SyncUserStore.getState().actions;

    if (syncUser.spreadsheetId === undefined || syncUser.accessToken === undefined) {
        throw new Error('no spreadsheetId or accessToken');
    }

    try {
        const response = await querySpreadsheet(syncUser.spreadsheetId, syncUser.accessToken, msg.data);
        let responseArray: boolean[] = [];
        if (response.table.rows && response.table.rows.length > 0) {
            for (let row of response.table.rows) {
                let index = row.c[0].v ? row.c[0].v : 0;
                let workId = row.c[1].v ? row.c[1].v : '';
                let status = row.c[2] ? row.c[2].v : 'read';
                let history = row.c[3] ? row.c[3].v : '';
                let personalTags = row.c[4] ? row.c[4].v.split(',') : [];
                let rating = row.c[5] ? row.c[5].v : 0;
                let readCount = row.c[6] ? row.c[6].v : 1;
                let skipReason = row.c[7] ? row.c[7].v : undefined;
                let work = { workId, index, status, history, personalTags, rating, readCount, skipReason };
                setStore(`${workId}`, work, StoreMethod.SESSION);
            }
            responseArray = compareArrays(msg.data, response.table.rows);
        }
        return responseArray;
    } catch (error: any) {
        throw new Error(error);
    }
}
