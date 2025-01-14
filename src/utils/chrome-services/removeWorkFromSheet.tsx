import { Ao3_BaseWork, BaseWork } from '../../pages/content-script';
import log from '../logger';
import { HttpMethod, makeRequest } from "./httpRequest";


/**
 * Adds a work entry to a Google Sheets spreadsheet.
 *
 * @param {string} spreadsheetId - The URL of the Google Sheets spreadsheet.
 * @param {string} accessT - The authentication token for Google Sheets API.
 * @param {number} workIndex - The work entry to be added to the spreadsheet.
 * @returns {Promise<boolean>} - A promise that resolves to true if the work entry was successfully added, otherwise throws an error.
 */
//TODO: currently hard coded for the first sheet, need to make it dynamic
export const removeWorkFromSheet = async (spreadsheetId: string, accessT: string, workIndex: number): Promise<boolean> => {
    log('removeWorkFromSheet');
    log('authToken', accessT);
    log('spreadsheetId', spreadsheetId);
    log('workIndex', workIndex);

    const response = await makeRequest({
        url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
        method: HttpMethod.POST,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessT}`,
        },
        body: {
            requests: [
                {
                    deleteDimension: {
                        range: {
                            sheetId: 0,
                            dimension: 'ROWS',
                            startIndex: workIndex - 1,
                            endIndex: workIndex
                        }
                    }
                }
            ],
            includeSpreadsheetInResponse: false
        }
    });

    const parsedResponse = await response.json();

    log('removeWorkFromSheet', 'response', parsedResponse);
    return response.ok;
}