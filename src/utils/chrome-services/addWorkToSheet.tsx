import { Ao3_BaseWork, BaseWork } from '../../pages/content-script';
import log from '../logger';
import { HttpMethod, makeRequest } from "./httpRequest";
import { User_BaseWork } from "../../pages/content-script/User_BaseWork";


/**
 * Adds a work entry to a Google Sheets spreadsheet.
 *
 * @param {string} spreadsheetId - The URL of the Google Sheets spreadsheet.
 * @param {string} authToken - The authentication token for Google Sheets API.
 * @param {BaseWork} work - The work entry to be added to the spreadsheet.
 * @returns {Promise<boolean>} - A promise that resolves to true if the work entry was successfully added, otherwise throws an error.
 */
//TODO: currently hard coded for the first sheet, need to make it dynamic
export const addWorkToSheet = async (spreadsheetId: string, authToken: string, work: Ao3_BaseWork): Promise<User_BaseWork> => {
    log('addWorkToSheet', work);
    log('authToken', authToken);
    log('spreadsheetId', spreadsheetId);

    const date = new Date();
    const sheetDate = date.toLocaleString()
    const ao3Date = `${date.getDay()} ${date.getMonth()} ${date.getFullYear()}`;

    const history = [{
        action: "added",
        date: sheetDate,
    }];

    const response = await makeRequest({
        url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/AccessWorks!A1:append?valueInputOption=USER_ENTERED&includeValuesInResponse=true`,
        method: HttpMethod.POST,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
        body: {

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
                            'read',
                            JSON.stringify(history),
                        ]


            ]
            /*requests: [
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
                                    { userEnteredValue: {formulaValue: '=ROW(INDIRECT("R[0]C[1]", FALSE))'}},                     //0
                                    { userEnteredValue: {numberValue: work.workId}},                     //1
                                    { userEnteredValue: {stringValue: work.title}},                      //2
                                    { userEnteredValue: {stringValue: work.authors.toString()},
                                        userEnteredFormat: {wrapStrategy: 'WRAP'} },                     //3
                                    { userEnteredValue: {stringValue: work.fandoms.toString()},
                                        userEnteredFormat: {wrapStrategy: 'WRAP'} },                     //4
                                    { userEnteredValue: {stringValue: work.relationships.toString()},
                                        userEnteredFormat: {wrapStrategy: 'WRAP'} },                     //5
                                    { userEnteredValue: {stringValue: work.tags.toString()},
                                        userEnteredFormat: {wrapStrategy: 'WRAP'} },                     //6
                                    { userEnteredValue: {stringValue: work.description},
                                        userEnteredFormat: {wrapStrategy: 'WRAP'} },                     //7
                                    { userEnteredValue: {numberValue: work.wordCount} },                 //8
                                    { userEnteredValue: {numberValue: work.chapterCount} },              //9
                                    { userEnteredValue: {stringValue: "read"}},                          //10
                                    { userEnteredValue: {stringValue: JSON.stringify(history)},
                                        userEnteredFormat: {wrapStrategy: 'WRAP'} },                     //11
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
            ],*/
        }
    });
    log('unparsed response', response);
    const parsedResponse = await response.json();

    log('addWorkToSheet', 'response', parsedResponse);

    let userWork = new User_BaseWork(
        parsedResponse.updates.updatedData.values[0][0],
        parsedResponse.updates.updatedData.values[0][1],
        parsedResponse.updates.updatedData.values[0][10],
        parsedResponse.updates.updatedData.values[0][11],
        [],
        0,
        1,
        'read'
    );
    return userWork;
}

    