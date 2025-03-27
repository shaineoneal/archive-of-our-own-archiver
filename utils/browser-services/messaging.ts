import { defineExtensionMessaging } from "@webext-core/messaging";
import { Ao3_BaseWork, User_BaseWork } from "@/entrypoints/content";
import { SyncUserStore, UserDataType } from "@/utils/zustand";
import {
    isAccessTokenValid,
    querySpreadsheet,
    addWorkToSheet,
    setAccessTokenCookie,
    getValidAccessToken,
    setStore,
    StoreMethod,
    handleTokenExchange,
    exchangeRefreshForAccessToken,
    chromeLaunchWebAuthFlow,
    requestAuthorization,
    createSpreadsheet,
    revokeTokens
} from "@/utils/browser-services";
import { updateWorkInSheet } from "@/utils/browser-services/updateWorkInSheet.tsx";


interface ProtocolMap {
    AddWorkToSpreadsheet(work: Ao3_BaseWork): User_BaseWork;
    GetValidAccessToken(): string;
    IsAccessTokenValid(accessToken: string): boolean;
    LoggedIn(data: UserDataType): void;
    Login(): void;
    QuerySpreadSheet(searchList: number[]): boolean[];
    UpdateWorkInSpreadsheet(work: User_BaseWork): boolean;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();

export async function handleAddWorkToSpreadsheet(msg: { data: Ao3_BaseWork }): Promise<User_BaseWork> {
    let sessionUser = await SyncUserStore.getState().actions.getUser();

    if (sessionUser.spreadsheetId !== undefined && sessionUser.accessToken !== undefined) {
        try {
            const work = await addWorkToSheet(sessionUser.spreadsheetId, sessionUser.accessToken, msg.data);
            setStore(`${msg.data.workId}`, work, StoreMethod.LOCAL);
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

export async function handleGetValidAccessToken(): Promise<string> {
    console.log("GetValidAccessToken");
    const user = await SyncUserStore.getState().actions.getUser();
    if(await isAccessTokenValid(user.accessToken)) {
        return user.accessToken;
    } else {
        const newAccessToken = await exchangeRefreshForAccessToken(user.refreshToken);
        if (newAccessToken) {
            SyncUserStore.getState().actions.userStoreLogin(newAccessToken, user.refreshToken, user.spreadsheetId);
            return newAccessToken;
        } else {
            throw new Error('Unable to retrieve a valid access token');
        }
    }
}

export async function handleLogin(): Promise<void> {
    const {getUser, userStoreLogin} = SyncUserStore.getState().actions;
    const user = await getUser();
    try {
        // Launch the web authentication flow with interactive set to true
        const flowResp = await chromeLaunchWebAuthFlow(true);

        // If the response has a URL and a code, request authorization
        if (flowResp.url && flowResp.code) {
            console.log('Flow response: ', flowResp);
            const {access_token, refresh_token} = await requestAuthorization(flowResp);

            //TODO: if no refresh token, fix it

            // If the response has a refresh token, store the async login
            // then send a message to the content script to update the login status
            if (refresh_token) {
                if (!user.spreadsheetId) {
                    const newSheet = await createSpreadsheet(access_token);
                    userStoreLogin(access_token, refresh_token, newSheet);
                    await sendMessage('LoggedIn', {accessToken: access_token, refreshToken: refresh_token, spreadsheetId: newSheet});
                } else {
                    userStoreLogin(access_token, refresh_token);
                    await sendMessage('LoggedIn', {accessToken: access_token, refreshToken: refresh_token});
                }


                const tabs = await browser.tabs.query({url: '*://archiveofourown.org/*'});
                if (tabs) {
                    tabs.forEach(tab => {
                        sendMessage('LoggedIn', {refreshToken: refresh_token, accessToken: access_token}, tab.id);
                    });
                }
            } else {
                console.log("No refresh token found, revoking tokens");
                await revokeTokens(access_token);
            }

        }
    } catch (error) {
        console.log('Error in handleLogin: ', error);
    }
}

export async function handleIsAccessTokenValid(msg: { data: string }): Promise<boolean> {
    return await isAccessTokenValid(msg.data);
}

export async function handleQuerySpreadSheet(msg: { data: number[] }): Promise<boolean[]> {
    const { setAccessToken, getUser } = SyncUserStore.getState().actions;
    let syncUser = await getUser();


    if (syncUser.spreadsheetId === '' || syncUser.accessToken === '') {
        throw new Error('no spreadsheetId or accessToken');
    }

    try {
        const response = await querySpreadsheet(syncUser.spreadsheetId!, syncUser.accessToken, msg.data);
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
                setStore(`${workId}`, work, StoreMethod.LOCAL);
            }
            responseArray = compareArrays(msg.data, response.table.rows);
        }
        return responseArray;
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function handleUpdateWorkInSpreadsheet(msg: { data: User_BaseWork }): Promise<boolean> {
    const { setAccessToken, getUser } = SyncUserStore.getState().actions;
    let syncUser = await getUser();

    if (syncUser.spreadsheetId === '' || syncUser.accessToken === '') {
        throw new Error('no spreadsheetId or accessToken');
    }

    try {
        const response = await updateWorkInSheet(syncUser.spreadsheetId!, syncUser.accessToken, msg.data);
        if (response) {
            setStore(`${msg.data.workId}`, msg.data, StoreMethod.LOCAL);
            return response;
        }
    } catch (error: any) {
        throw new Error(error);
    }
    return false;
}
