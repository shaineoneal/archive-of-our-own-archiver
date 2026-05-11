import { logger } from "@/utils";
import { defineExtensionMessaging } from "@webext-core/messaging";
import { getAndSetTokens, getSpreadsheetId, shelfSetWork } from "@/stores";
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
    sendMessageToAo3Tabs
} from "@/services";
import { Work } from "@/models"
import { addToHistory } from "@/services/updateWorkInSheet.ts";
import { Spreadsheet } from "@/models/sheet.ts";

/**
 * Maps message names to request/response types for extension messaging.
 * @category Messaging
 */
interface ProtocolMap {
    AddWorkToSpreadsheet(work: Work): Work;
    GetValidAccessToken(): string;
    IsAccessTokenValid(accessToken: string): boolean;
    LoggedIn(data: any): void;
    Login(): void;

    /**
     * Queries the spreadsheet for works matching the provided search list.
     *
     * @see {@link handleQuerySpreadSheet} for implementation details.
     */
    QuerySpreadSheet(searchList: string[]): void;
    UpdateWorkInSpreadsheet(work: Work): boolean;
}

/**
 * Messaging helpers generated from the protocol map.
 * @category Messaging
 */
export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();

/**
 * Adds a work to the user's spreadsheet and updates the shelf store.
 *
 * @param msg - Message payload containing the work to add.
 * @returns The appended work returned by the sheet.
 * @throws If the user is missing credentials or token exchange fails.
 * @remarks
 * - Updates the shelf store on success.
 * @category Messaging
 */
export async function handleAddWorkToSpreadsheet(msg: { data: Work }): Promise<Work> {
    logger.info('Received addWorkToSpreadsheet message: ', msg.data);

    const { accessToken } = await getAndSetTokens();
    const spreadsheetId = await getSpreadsheetId();

    if (!spreadsheetId || !accessToken) throw new Error('no spreadsheetId or accessToken');

    const work = Work.rehydrateWork(msg.data);
    const ss = new Spreadsheet(spreadsheetId);

    try {
        const appendedWork = await addWorkToSheet(ss, accessToken, work);
        shelfSetWork(appendedWork);
        return appendedWork;
    } catch (error) {
        throw new Error('access token expired or invalid, and there was an error exchanging the refresh token', { cause: error });
    }
}

/**
 * Ensures a valid access token, refreshing via the stored refresh token when needed.
 *
 * @returns A valid access token.
 * @throws If a valid access token cannot be retrieved.
 * @remarks Updates the user store when a new access token is obtained.
 * @category Messaging
 */
export async function handleGetValidAccessToken(): Promise<string> {
    logger.info('Received getValidAccessToken message');

    const { accessToken, refreshToken } = await getAndSetTokens();

    if (await isAccessTokenValid(accessToken)) {
        return accessToken!;
    } else {
        const newAccessToken = await exchangeRefreshForAccessToken(refreshToken);
        if (newAccessToken) {
            await setTokens({ accessToken: newAccessToken, refreshToken });
            return newAccessToken;
        } else {
            throw new Error('Unable to retrieve a valid access token');
        }
    }
}

/**
 * Initiates the login flow and persists tokens on success.
 * @remarks
 * - Launches the web auth flow.
 * - May create a spreadsheet.
 * - Updates the user store.
 * - Notifies AO3 tabs.
 * @category Messaging
 */
export async function handleLogin(): Promise<void> {
    logger.info('Received login message');

    try {
        // Launch the web authentication flow with interactive set to true
        const flowResp = await chromeLaunchWebAuthFlow(true);

        // If the response has a URL and a code, request authorization
        if (flowResp.url && flowResp.code) {
            logger.debug('WebAuthFlow response: ', flowResp);
            const { access_token, refresh_token } = await requestAuthorization(flowResp);

            // TODO: if no refresh token, fix it

            // If the response has a refresh token, store the async login
            // then send a message to the content script to update the login status
            if (refresh_token) {
                await setTokens({ accessToken: access_token, refreshToken: refresh_token });

                if (!await getSpreadsheetId()) {
                    // If the user has no spreadsheetId, create a new one
                    const newSheet = await createSpreadsheet(access_token);
                    setSpreadsheetId(newSheet);

                    await sendMessage('LoggedIn', {accessToken: access_token, refreshToken: refresh_token, spreadsheetId: newSheet});
                    await sendMessageToAo3Tabs('LoggedIn');
                } else {
                    logger.debug('Sending message');
                    //await sendMessage('LoggedIn', {accessToken: access_token, refreshToken: refresh_token, spreadsheetId: user.spreadsheetId});
                    await sendMessageToAo3Tabs('LoggedIn' );
                }
            } else {
                logger.debug('No refresh token found, revoking tokens');
                await revokeTokens();
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
 * @category Messaging
 */
export async function handleIsAccessTokenValid(msg: { data: string }): Promise<boolean> {
    return await isAccessTokenValid(msg.data);
}

/**
 * Queries the spreadsheet for works matching the provided search list.
 *
 * @param msg - Message payload containing the list of search terms.
 * @throws If the user is missing credentials or query fails.
 * @remarks Updates the shelf store with matched works.
 * @category Messaging
 */
export async function handleQuerySpreadSheet(msg: { data: string[] }): Promise<void> {
    logger.info('Received querySpreadSheet message with searchList: ', msg.data);
    const { accessToken } = await getAndSetTokens();
    const spreadsheetId = await getSpreadsheetId();
    const searchList = msg.data ?? [];

    if (searchList.length === 0) {
        return;
    }

    try {
        const response = await querySpreadsheet(spreadsheetId, accessToken, searchList);
        logger.debug('Response from querySpreadsheet: ', response);

        const rows = Array.isArray(response?.table?.rows) ? (response.table.rows as GvizRow[]) : [];
        if (rows.length === 0) {
            if (!Array.isArray(response?.table?.rows)) {
                logger.error('Invalid response from querySpreadsheet:', response);
            }
            return;
        }

        shelfSetShelf(rows.map((row) => {
            return Work.fromRow(row);
        }));

        return;
    } catch (error) {
        throw new Error('querySpreadsheet failed:', { cause: error });
    }
}

/**
 * Adds a history update for a work and refreshes the shelf store.
 *
 * @param msg - Message payload containing the work to update.
 * @returns True if the update succeeded; otherwise false.
 * @throws If the user is missing credentials or the update fails.
 * @remarks Updates the shelf store on success.
 * @category Messaging
 */
export async function handleUpdateWorkInSpreadsheet(msg: { data: Work }): Promise<boolean> {
    const { accessToken } = await getAndSetTokens();
    const spreadsheetId = await getSpreadsheetId();

    if (spreadsheetId === '' || accessToken === '') {
        throw new Error('no spreadsheetId or accessToken');
    }

    try {
        const response = await addToHistory(msg.data, spreadsheetId, accessToken);
        logger.debug('row', response);
        if (response) {
            logger.debug('Response from addToHistory: ', msg.data);
            shelfSetWork(msg.data);
            return true;
        }
    } catch (error) {
        throw new Error('addToHistory failed:', { cause: error });
    }
    return false;
}
