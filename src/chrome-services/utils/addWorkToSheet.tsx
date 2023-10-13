import { log } from '../../utils';
import { BaseWork } from '../../works/BaseWork';
import { getSheetId } from './getSheetId';



/**
 * The `addWorkToSheet` function is used to add a new work to a Google Sheets document using the Google
 *  Sheets API.
 * @param {string} spreadsheetUrl - The `spreadsheetUrl` parameter is a string that represents the URL
 *      of the Google Sheets spreadsheet where the work will be added.
 * @param {string} authToken - The `authToken` parameter is a string that represents the authentication
 *      token required to access the Google Sheets API. This token is used to authorize the API requests
 *      made by the code.
 * @param {BaseWork} work - The `work` parameter is an object of type `BaseWork` which contains the
 *      following properties:
 * @returns the result of the fetch request, which is a Promise that resolves to the JSON response from
 *      the API.
 */
export const addWorkToSheet = async (spreadsheetUrl: string, authToken: string, work: BaseWork, lastRow: number) => {;
    log('addWorkToSheet', work);

    const sheetId: number = await getSheetId(spreadsheetUrl, authToken);
    log('addWorkToSheet', 'sheetId', sheetId);

    const currRow: number = lastRow + 1;

    return fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetUrl.split('/')[5]}:batchUpdate`,
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
            requests: [
                {
                    updateCells: {
                        start: { sheetId: sheetId, rowIndex: currRow, columnIndex: 0 },
                        rows: [
                            { values: [
                                { userEnteredValue: { numberValue: currRow } },                         //0
                                { userEnteredValue: { numberValue: work.workId } },                     //1
                                { userEnteredValue: { stringValue: work.title } },                      //2
                                { userEnteredValue: { stringValue: work.author.toString() },
                                    userEnteredFormat: { wrapStrategy: 'WRAP' } },                      //3   
                                { userEnteredValue: { stringValue: work.fandoms.toString() },
                                    userEnteredFormat: { wrapStrategy: 'WRAP' } },                      //4
                                { userEnteredValue: { stringValue: work.relationships.toString() },
                                    userEnteredFormat: { wrapStrategy: 'WRAP' } },                      //5
                                { userEnteredValue: { stringValue: work.tags.toString() },
                                    userEnteredFormat: { wrapStrategy: 'WRAP' } },                      //6
                                { userEnteredValue: { stringValue: work.description },
                                    userEnteredFormat: { wrapStrategy: 'WRAP' } },                      //7
                                { userEnteredValue: { numberValue: work.wordCount } },                  //8   
                                { userEnteredValue: { numberValue: work.totalChapters } },              //9
                                { userEnteredValue: { stringValue: work.status } },                     //10
                                { userEnteredValue: { numberValue: work.rating } },                     //11
                            ] },
                        ], 
                        fields: '*'
                    }
                },
                {
                    autoResizeDimensions: {
                        dimensions: {
                            sheetId: sheetId,
                            dimension: 'ROWS'
                        }
                    }
                }
            ],
            includeSpreadsheetInResponse: false
        }),
    }
    ).then((res) => res.json());
}

    
//need to use values.append so row can be attached to ao3 blurb
export const ALTaddWorkToSheet = async (spreadsheetUrl: string, authToken: string, work: BaseWork) => {;
    log('addWorkToSheet', work);

    const sheetId: number = await getSheetId(spreadsheetUrl, authToken);
    log('addWorkToSheet', 'sheetId', sheetId);

    return fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetUrl.split('/')[5]}/values/SavedWorks!A1:K1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
            'range': 'SavedWorks!A1:K1',
            'majorDimension': 'ROWS',
            'values': [
                [
                    work.workId,                        //A
                    work.title,                         //B
                    work.author.toString(),             //C 
                    work.fandoms.toString(),            //D
                    work.relationships.toString(),      //E
                    work.tags.toString(),               //F
                    work.description,                   //G
                    work.wordCount,                     //H
                    work.totalChapters,                 //I
                    work.status,                        //J
                    work.rating,                        //K
                ],  
            ],
        }),
    }
    ).then((res) => res.json());
}

export const getRowFromResponse = (response: any) => {
    log('getRowFromResponse', response);
    return response.updates.updatedRange.split('!')[1].split(':')[0][1];
}