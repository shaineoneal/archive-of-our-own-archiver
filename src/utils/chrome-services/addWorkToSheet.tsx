import { Ao3_BaseWork, BaseWork } from '../../pages/content-script';
import { User_BaseWork } from "../../pages/content-script/User_BaseWork";
import { log } from '../logger';
import { HttpMethod, makeRequest } from "./httpRequest";


/**
 * Adds a work entry to a Google Sheets spreadsheet.
 *
 * @param {string} spreadsheetId - The URL of the Google Sheets spreadsheet.
 * @param {string} authToken - The authentication token for Google Sheets API.
 * @param {BaseWork} work - The work entry to be added to the spreadsheet.
 * @returns {Promise<boolean>} - A promise that resolves to true if the work entry was successfully added, otherwise throws an error.
 */
//TODO: currently hard coded for the first sheet, need to make it dynamic
interface HistoryEntry {
    action: string;
    date: string;
}

interface RequestBody {
    range: string;
    majorDimension: string;
    values: any[][];
const createHistoryEntry = (): HistoryEntry[] => {
    const date = new Date();
    const sheetDate = date.toLocaleString();
    return [{
        action: "added",
        date: sheetDate,
    }];
};

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

    let userWork = new User_BaseWork(
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