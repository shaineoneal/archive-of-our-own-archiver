import { Ao3_BaseWork, Work } from '@/entrypoints/content';
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
 * @param {Work} defaultUserWork - The default user work entry.
 * @returns {RequestBody} - The request body.
 */
const createRequestBody = (work: Work, history: HistoryEntry[]): RequestBody => ({
    range: 'AccessWorks!A1',
    majorDimension: 'ROWS',
    values: [
        [
            '=ROW(INDIRECT("R[0]C[1]", FALSE))',
            work.workId,
            work.info?.title ?? '',
            work.info?.authors?.toString() ?? '',
            work.info?.fandoms?.toString() ?? '',
            work.info?.relationships?.toString() ?? '',
            work.info?.tags?.toString() ?? '',
            work.info?.description,
            work.info?.wordCount,
            work.info?.chapterCount,
            'read',     //TODO: change this to a variable
            JSON.stringify(history),
            JSON.stringify(work.info?.chapters ?? []),
            work.info?.personalTags?.toString() ?? '',
            work.info?.rating,
            work.info?.readCount ?? 1,
            work.info?.skipReason?.toString() ?? ''
        ]
    ]
});

/**
 * Adds a work entry to a Google Sheets spreadsheet.
 *
 * @param {string} spreadsheetId - The URL of the Google Sheets spreadsheet.
 * @param {string} authToken - The authentication token for Google Sheets API.
 * @param {Work} work - The work entry to be added to the spreadsheet.
 * @returns {Promise<Work>} - A promise that resolves to the added work entry.
 */
export const addWorkToSheet = async (spreadsheetId: string, authToken: string, work: Work): Promise<Work> => {
    console.log('addWorkToSheet', work);
    console.log('authToken', authToken);
    console.log('spreadsheetId', spreadsheetId);

    // Create history entry and default user work
    const history = createHistoryEntry();
    const defaultUserWork = new Work(work.workId);

    // Make request to Google Sheets API
    const response = await makeRequest({
        url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/AccessWorks!A1:append?valueInputOption=USER_ENTERED&includeValuesInResponse=true`,
        method: HttpMethod.POST,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
        body: createRequestBody(work, history)
    });

    console.log('unparsed response', response);
    const parsedResponse = await response.json();

    console.log('addWorkToSheet', 'response', parsedResponse);

    // Handle potential authentication error
    if (parsedResponse.error && parsedResponse.status === 'UNAUTHENTICATED') {
        throw new Error('Error adding work to sheet: UNAUTHENTICATED');
    }

    // Return the added work entry
    return new Work(
        parsedResponse.updates.updatedData.values[0][1],
        {
            index: parsedResponse.updates.updatedData.values[0][0],
            title: parsedResponse.updates.updatedData.values[0][2],
            authors: parsedResponse.updates.updatedData.values[0][3],
            fandoms: parsedResponse.updates.updatedData.values[0][4],
            relationships: parsedResponse.updates.updatedData.values[0][5],
            tags: parsedResponse.updates.updatedData.values[0][6],
            description: parsedResponse.updates.updatedData.values[0][7],
            wordCount: parsedResponse.updates.updatedData.values[0][8],
            chapterCount: parsedResponse.updates.updatedData.values[0][9],
            status: parsedResponse.updates.updatedData.values[0][10],
            history: parsedResponse.updates.updatedData.values[0][11],
            chapters: parsedResponse.updates.updatedData.values[0][12],
            personalTags: parsedResponse.updates.updatedData.values[0][13],
            rating: parsedResponse.updates.updatedData.values[0][14],
            readCount: parsedResponse.updates.updatedData.values[0][15],
            skipReason: parsedResponse.updates.updatedData.values[0][16]
        }
    );
};