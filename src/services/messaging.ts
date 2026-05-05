import { logger } from "@/utils";
import { defineExtensionMessaging } from "@webext-core/messaging";
import { UserStore, UserDataType, shelfSetWork, shelfSetShelf } from "@/stores";
import type { GvizRow } from "@/types/gvizDataTable.ts";
import {
    addWorkToSheet,
    chromeLaunchWebAuthFlow,
    createSpreadsheet,
    exchangeRefreshForAccessToken,
    isAccessTokenValid,
    querySpreadsheet,
    requestAuthorization,
    revokeTokens,
    sendMessageToAo3Tabs,
    Work
} from "@/services";
import { addToHistory } from "@/services/updateWorkInSheet.ts";
import { pageTypeDetect } from "@/entrypoints/content/other/content_script.tsx";
import { Spreadsheet } from "@/models/sheet.ts";

/**
 * Messaging protocol for extension requests and responses.
 * Each key maps a message name to its request/response types.
 */
interface ProtocolMap {
    AddWorkToSpreadsheet(work: Work): Work;
    GetValidAccessToken(): string;
    IsAccessTokenValid(accessToken: string): boolean;
    LoggedIn(data: UserDataType): void;
    Login(): void;
    QuerySpreadSheet(searchList: string[]): void;
    UpdateWorkInSpreadsheet(work: Work): boolean;
}

/**
 * Messaging helpers generated from the protocol map.
 */
export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();

/**
 * Handles adding a work to the user's spreadsheet.
 * Rehydrates the work model, appends it, and updates the shelf store.
 *
 * @param msg - Message payload containing the work to add.
 * @returns The appended work returned by the sheet.
 * @throws If the user is missing credentials or token exchange fails.
 */
export async function handleAddWorkToSpreadsheet(msg: { data: Work }): Promise<Work> {
    logger.info("Received addWorkToSpreadsheet message: ", msg.data);

    const user = await UserStore.getState().actions.getUser();
    const work = Work.rehydrateWork(msg.data);

    if (user.spreadsheetId !== undefined && user.accessToken !== undefined) {
        const ss = new Spreadsheet(user.spreadsheetId);

        try {
            const appendedWork = await addWorkToSheet(ss, user.accessToken, work);
            shelfSetWork(appendedWork);
            return appendedWork;
        } catch (error) {
            throw new Error('access token expired or invalid, and there was an error exchanging the refresh token', { cause: error });
        }
    } else {
        throw new Error('no spreadsheetId or accessToken');
    }
}

/**
 * Ensures a valid access token is returned.
 * If the current token is invalid, attempts a refresh-token exchange.
 *
 * @returns A valid access token.
 * @throws If a valid access token cannot be retrieved.
 */
export async function handleGetValidAccessToken(): Promise<string> {
    logger.info("Received getValidAccessToken message");

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

/**
 * Initiates the login flow and persists tokens on success.
 * Creates a spreadsheet when the user does not yet have one.
 */
export async function handleLogin(): Promise<void> {
    logger.info("Received login message");

    const { getUser, userStoreLogin } = UserStore.getState().actions;
    const user = await getUser();
    try {
        // Launch the web authentication flow with interactive set to true
        const flowResp = await chromeLaunchWebAuthFlow(true);

        // If the response has a URL and a code, request authorization
        if (flowResp.url && flowResp.code) {
            logger.debug('Flow response: ', flowResp);
            const {access_token, refresh_token} = await requestAuthorization(flowResp);

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

/**
 * Validates whether an access token is still valid.
 *
 * @param msg - Message payload containing the access token to validate.
 * @returns True if the token is valid; otherwise false.
 */
export async function handleIsAccessTokenValid(msg: { data: string }): Promise<boolean> {
    return await isAccessTokenValid(msg.data);
}

/**
 * Queries the spreadsheet for works matching the provided search list.
 * Updates the shelf store with matched works.
 *
 * @param msg - Message payload containing the list of search terms.
 * @throws If the user is missing credentials or query fails.
 */
export async function handleQuerySpreadSheet(msg: { data: string[] }): Promise<void> {
    logger.info("Received querySpreadSheet message with searchList: ", msg.data);

    const user = await UserStore.getState().actions.getUser();
    const searchList = msg.data ?? [];

    if (searchList.length === 0) {
        return;
    }

    if (user.spreadsheetId === '' || user.accessToken === '') {
        throw new Error('no spreadsheetId or accessToken');
    }

    try {
        const response = await querySpreadsheet(user.spreadsheetId, user.accessToken, searchList);
        logger.debug('Response from querySpreadsheet: ', response);

        const rows = Array.isArray(response?.table?.rows) ? (response.table.rows as GvizRow[]) : [];
        if (rows.length === 0) {
            if (!Array.isArray(response?.table?.rows)) {
                logger.error('Invalid response from querySpreadsheet:', response);
            }
            return;
        }

        shelfSetShelf(rows.map(row => {
            return Work.fromRow(row);
        }));

        return;
    } catch (error) {
        throw new Error("querySpreadsheet failed:", { cause: error });
    }
}

/**
 * Adds an update to a work's history in the spreadsheet and updates the shelf store.
 *
 * @param msg - Message payload containing the work to update.
 * @returns True if the update succeeded; otherwise false.
 * @throws If the user is missing credentials or the update fails.
 */
export async function handleUpdateWorkInSpreadsheet(msg: { data: Work }): Promise<boolean> {
    const user = await UserStore.getState().actions.getUser();

    if (user.spreadsheetId === '' || user.accessToken === '') {
        throw new Error('no spreadsheetId or accessToken');
    }

    try {
        const response = await addToHistory(msg.data, user.spreadsheetId, user.accessToken);
        logger.debug('row', response);
        if (response) {
            logger.debug('Response from addToHistory: ', msg.data);
            shelfSetWork(msg.data);
            return true;
        }
    } catch (error) {
        throw error;
    }
    return false;
}

/**
 * Handles a LoggedIn message and updates the user store.
 * Triggers page type detection after login.
 *
 * @param msg - Message payload containing the user's login data (access token, refresh token, spreadsheet ID).
 */
export async function handleLoggedIn(msg: { data: UserDataType }): Promise<void> {

    logger.debug('logged in message received', msg.data);
    const { userStoreLogin } = UserStore.getState().actions;

    if (msg.data.accessToken && msg.data.refreshToken && msg.data.spreadsheetId) {
        userStoreLogin(msg.data.accessToken, msg.data.refreshToken, msg.data.spreadsheetId);
    }
        //logger.debug('userStoreLogin done', UserStore.getState().user);
    pageTypeDetect();
}