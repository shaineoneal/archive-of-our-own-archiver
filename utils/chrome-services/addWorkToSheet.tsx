import { Ao3_BaseWork, BaseWork } from '@/entrypoints/content';
import { User_BaseWork } from "@/entrypoints/content/User_BaseWork.tsx";
import { log } from '@/utils/logger.ts';
import { HttpMethod, makeRequest } from "./httpRequest.ts";

//TODO: currently hard coded for the first sheet, need to make it dynamic

/**
 * Represents a history entry.
 */
interface HistoryEntry {
    action: string;
    date: string;
}

/**
 * Represents the request body for adding a work entry to the Google Sheets spreadsheet.
 */
interface RequestBody {
    range: string;
    majorDimension: string;
    values: any[][];
}

/**
 * Creates a history entry with the current date and action "added".
 *
 * @returns {HistoryEntry[]} - An array containing the history entry.
 */
const createHistoryEntry = (): HistoryEntry[] => {
    const date = new Date();
    const sheetDate = date.toLocaleString();
    return [{
        action: "added",
        date: sheetDate,
    }];
};

/**
 * Creates the request body for adding a work entry to the Google Sheets spreadsheet.
 *
 * @param {Ao3_BaseWork} work - The work entry to be added.
 * @param {HistoryEntry[]} history - The history entry.
 * @param {User_BaseWork} defaultUserWork - The default user work entry.
 * @returns {RequestBody} - The request body.
 */
const createRequestBody = (work: Ao3_BaseWork, history: HistoryEntry[], defaultUserWork: User_BaseWork): RequestBody => ({
    range: 'AccessWorks!A1',
    majorDimension: 'ROWS',
    values: [
        [
            '=ROW(INDIRECT("R[0]C[1]", FALSE))',
            work.workId,
            work.title,
            work.authors.toString(),
            work.fandoms.toString(),
            work.relationships.toString(),
            work.tags.toString(),
            work.description,
            work.wordCount,
            work.chapterCount,
            'read',     //TODO: change this to a variable
            JSON.stringify(history),
            defaultUserWork.personalTags?.toString() ?? '',
            defaultUserWork.rating,
            defaultUserWork.readCount,
            defaultUserWork.skipReason?.toString() ?? ''
        ]
    ]
});

/**
 * Adds a work entry to a Google Sheets spreadsheet.
 *
 * @param {string} spreadsheetId - The URL of the Google Sheets spreadsheet.
 * @param {string} authToken - The authentication token for Google Sheets API.
 * @param {BaseWork} work - The work entry to be added to the spreadsheet.
 * @returns {Promise<User_BaseWork>} - A promise that resolves to the added work entry.
 */
export const addWorkToSheet = async (spreadsheetId: string, authToken: string, work: Ao3_BaseWork): Promise<User_BaseWork> => {
    log('addWorkToSheet', work);
    log('authToken', authToken);
    log('spreadsheetId', spreadsheetId);

    // Create history entry and default user work
    const history = createHistoryEntry();
    const defaultUserWork = new User_BaseWork(work.workId);

    // Make request to Google Sheets API
    const response = await makeRequest({
        url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/AccessWorks!A1:append?valueInputOption=USER_ENTERED&includeValuesInResponse=true`,
        method: HttpMethod.POST,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
        body: createRequestBody(work, history, defaultUserWork)
    });

    log('unparsed response', response);
    const parsedResponse = await response.json();

    log('addWorkToSheet', 'response', parsedResponse);

    // Handle potential authentication error
    if (parsedResponse.error && parsedResponse.status === 'UNAUTHENTICATED') {
        throw new Error('Error adding work to sheet: UNAUTHENTICATED');
    }

    // Return the added work entry
    return new User_BaseWork(
        parsedResponse.updates.updatedData.values[0][0],
        parsedResponse.updates.updatedData.values[0][1],
        parsedResponse.updates.updatedData.values[0][10],
        parsedResponse.updates.updatedData.values[0][11],
        [],
        0,
        1,
        'read'
    );
};