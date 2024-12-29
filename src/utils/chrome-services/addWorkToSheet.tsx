import { Ao3_BaseWork, BaseWork } from '../../pages/content-script';
import log from '../logger';
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
export const addWorkToSheet = async (spreadsheetId: string, authToken: string, work: Ao3_BaseWork): Promise<boolean> => {
    log('addWorkToSheet', work);
    log('authToken', authToken);
    log('spreadsheetId', spreadsheetId);

    const history = {
        action: "added",
        date: new Date().toLocaleString(),
    }

    const response = await makeRequest({
        url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
        method: HttpMethod.POST,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
        body: {
            requests: [
                {
                    appendDimension: {
                        sheetId: 0,
                        dimension: 'ROWS',
                        length: 1,
                    }
                },
                {
                    appendCells: {
                        sheetId: 0,
                        rows: [
                            {
                                values: [
                                    { userEnteredValue: {numberValue: work.workId}},                     //0
                                    { userEnteredValue: {stringValue: work.title}},                      //1
                                    { userEnteredValue: {stringValue: work.authors.toString()},
                                        userEnteredFormat: {wrapStrategy: 'WRAP'} },                     //2
                                    { userEnteredValue: {stringValue: work.fandoms.toString()},
                                        userEnteredFormat: {wrapStrategy: 'WRAP'} },                     //3
                                    { userEnteredValue: {stringValue: work.relationships.toString()},
                                        userEnteredFormat: {wrapStrategy: 'WRAP'} },                     //4
                                    { userEnteredValue: {stringValue: work.tags.toString()},
                                        userEnteredFormat: {wrapStrategy: 'WRAP'} },                     //5
                                    { userEnteredValue: {stringValue: work.description},
                                        userEnteredFormat: {wrapStrategy: 'WRAP'} },                     //6
                                    {userEnteredValue: {numberValue: work.wordCount}},                   //7
                                    {userEnteredValue: {numberValue: work.chapterCount}},
                                    { userEnteredValue: {stringValue: "read"}},
                                    { userEnteredValue: {stringValue: JSON.stringify(history)},
                                        userEnteredFormat: {wrapStrategy: 'WRAP'} },                     //9
                                ]
                            },
                        ],
                        fields: '*',
                    }
                },
                {
                    autoResizeDimensions: {
                        dimensions: {
                            sheetId: 0,
                            dimension: 'ROWS'
                        }
                    }
                }
            ],
            includeSpreadsheetInResponse: false
        }
    });

    const parsedResponse = await response.json();

    log('addWorkToSheet', 'response', parsedResponse);
    return response.ok;
}

    