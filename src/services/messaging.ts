import { defineExtensionMessaging } from "@webext-core/messaging";
import { UserDataType, UserStore } from "@/stores";
import {
    addWorkToSheet,
    chromeLaunchWebAuthFlow,
    createSpreadsheet,
    exchangeRefreshForAccessToken,
    getValidAccessToken,
    handleTokenExchange,
    isAccessTokenValid,
    querySpreadsheet,
    requestAuthorization,
    revokeTokens,
    setStore,
    StoreMethod,
    Work
} from "@/services";
import { addToHistory } from "@/services/updateWorkInSheet.ts";
import { pageTypeDetect } from "@/entrypoints/content/other/content_script.tsx";
import { TokenService } from "@/services/tokenService.ts";


interface ProtocolMap {
    AddWorkToSpreadsheet(work: Work): Work;
    GetValidAccessToken(): string;
    IsAccessTokenValid(accessToken: string): boolean;
    LoggedIn(data: UserDataType): void;
    Login(): void;
    QuerySpreadSheet(searchList: number[]): boolean[];
    UpdateWorkInSpreadsheet(work: Work): boolean;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();

export async function handleAddWorkToSpreadsheet(msg: { data: Work }): Promise<Work> {
    let sessionUser = await UserStore.getState().actions.getUser();

    if (sessionUser.spreadsheetId !== undefined && sessionUser.accessToken !== undefined) {
        try {
            const work = await addWorkToSheet(sessionUser.spreadsheetId, sessionUser.accessToken, msg.data);
            setStore(`${msg.data.workId}`, work.info, StoreMethod.LOCAL);
            return work;
        } catch (error) {
            console.error('error adding work to sheet', error);
            if (sessionUser.refreshToken) {
                let accessT = await getValidAccessToken(sessionUser.accessToken, sessionUser.refreshToken);
                if (accessT) {
                    sessionUser.accessToken = accessT;
                    setStore('user', sessionUser, StoreMethod.SYNC);
                    return await handleTokenExchange<Work>(sessionUser.refreshToken);
                }
            }
            throw new Error('access token expired or invalid, and there was an error exchanging the refresh token');
        }
    } else {
        throw new Error('no spreadsheetId or accessToken');
    }
}

export async function handleGetValidAccessToken(): Promise<string> {
    logger.debug("GetValidAccessToken");
    const user = await UserStore.getState().actions.getUser();
    if(await isAccessTokenValid(user.accessToken)) {
        return user.accessToken;
    } else {
        const newAccessToken = await exchangeRefreshForAccessToken(user.refreshToken);
        if (newAccessToken) {
            UserStore.getState().actions.userStoreLogin(newAccessToken, user.refreshToken, user.spreadsheetId);
            return newAccessToken;
        } else {
            throw new Error('Unable to retrieve a valid access token');
        }
    }
}

export async function handleLogin(): Promise<void> {
    const {getUser, userStoreLogin} = UserStore.getState().actions;
    const user = await getUser();
    try {
        // Launch the web authentication flow with interactive set to true
        const flowResp = await chromeLaunchWebAuthFlow(true);

        // If the response has a URL and a code, request authorization
        if (flowResp.url && flowResp.code) {
            logger.debug('Flow response: ', flowResp);
            const {access_token, refresh_token} = await requestAuthorization(flowResp);

            logger.debug('Access token: ', access_token);
            logger.debug('Refresh token: ', refresh_token);
            logger.debug('SpreadsheetId: ', user.spreadsheetId);
            //TODO: if no refresh token, fix it

            // If the response has a refresh token, store the async login
            // then send a message to the content script to update the login status
            if (refresh_token) {
                if (!user.spreadsheetId || user.spreadsheetId === '') {
                    // If the user has no spreadsheetId, create a new one
                    const newSheet = await createSpreadsheet(access_token);
                    userStoreLogin(access_token, refresh_token, newSheet);

                    await sendMessage('LoggedIn', {accessToken: access_token, refreshToken: refresh_token, spreadsheetId: newSheet});
                    await sendMessageToAo3Tabs('LoggedIn');
                } else {
                    const success = await storage.setItem('session:test', 'testing')
                    logger.debug('Storage set success: ', success);
                    userStoreLogin(access_token, refresh_token, user.spreadsheetId);
                    logger.debug('Sending message');
                    //await sendMessage('LoggedIn', {accessToken: access_token, refreshToken: refresh_token, spreadsheetId: user.spreadsheetId});
                    await sendMessageToAo3Tabs('LoggedIn' );
                }
            } else {
                logger.debug("No refresh token found, revoking tokens");
                await revokeTokens(access_token);
            }

        }
    } catch (error) {
        logger.error('Error in handleLogin: ', error);
    }
}

export async function handleIsAccessTokenValid(msg: { data: string }): Promise<boolean> {
    return await isAccessTokenValid(msg.data);
}

export async function handleQuerySpreadSheet(msg: { data: number[] }): Promise<boolean[]> {
    const { setAccessToken, getUser } = UserStore.getState().actions;
    let syncUser = await getUser();
    await TokenService.getUser()
    const success = await storage.setItem('session:test', 'testing')
    logger.debug('Storage set success: ', success);

    if (syncUser.spreadsheetId === '' || syncUser.accessToken === '') {
        throw new Error('no spreadsheetId or accessToken');
    }

    try {
        const response = await querySpreadsheet(syncUser.spreadsheetId!, syncUser.accessToken, msg.data);
        if (!response || !response.table || !response.table.rows) {
            logger.error('Invalid response from querySpreadsheet:', response);
        }
        let responseArray: boolean[] = [];
        if (response.table.rows && response.table.rows.length > 0) {
            for (let row of response.table.rows) {
                logger.debug('row', row);
                const work = Work.fromSheet(row)
                logger.debug('work', work);
                setStore(`${work.workId}`, work.info, StoreMethod.LOCAL);
            }
            responseArray = compareArrays(msg.data, response.table.rows);
        }
        return responseArray;
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function handleUpdateWorkInSpreadsheet(msg: { data: Work }): Promise<boolean> {
    const { setAccessToken, getUser } = UserStore.getState().actions;
    let syncUser = await getUser();

    if (syncUser.spreadsheetId === '' || syncUser.accessToken === '') {
        throw new Error('no spreadsheetId or accessToken');
    }

    try {
        const response = await addToHistory(msg.data, syncUser.spreadsheetId, syncUser.accessToken);
        logger.debug('row', response);
        if (response) {
            setStore(`${msg.data.workId}`, msg.data.info, StoreMethod.LOCAL);
            return response;
        }
    } catch (error: any) {
        throw new Error(error);
    }
    return false;
}

export async function handleLoggedIn(msg: { data: UserDataType }): Promise<void> {

    logger.debug('logged in message received', msg.data);
    const { userStoreLogin } = UserStore.getState().actions;

    if (msg.data.accessToken && msg.data.refreshToken && msg.data.spreadsheetId) {
        userStoreLogin(msg.data.accessToken, msg.data.refreshToken, msg.data.spreadsheetId);
    }
        //logger.debug('userStoreLogin done', UserStore.getState().user);
    pageTypeDetect();
}