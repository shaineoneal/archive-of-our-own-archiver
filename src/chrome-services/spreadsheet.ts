import { retrieveAccessToken, makeRequest, HttpMethod, syncStorageSet } from '.';
import log from '../utils/logger';

const headerRowData = [
    {
        startRow: 0,
        startColumn: 0,
        rowData:  [
            {
                values: [
                    {
                        userEnteredValue: { numberValue: 0 },
                    },
                    {
                        userEnteredValue: { stringValue: 'Work ID' },
                        userEnteredFormat: { textFormat: { bold: true } },
                    },
                    {
                        userEnteredValue: { stringValue: 'Title' },
                        userEnteredFormat: { textFormat: { bold: true } },
                    },
                    {
                        userEnteredValue: { stringValue: 'Authors' },
                        userEnteredFormat: { textFormat: { bold: true } },
                    },
                    {
                        userEnteredValue: { stringValue: 'Fandoms' },
                        userEnteredFormat: { textFormat: { bold: true } },
                    },
                    {
                        userEnteredValue: { stringValue: 'Relationships' },
                        userEnteredFormat: { textFormat: { bold: true } },
                    },
                    {
                        userEnteredValue: { stringValue: 'Tags' },
                        userEnteredFormat: { textFormat: { bold: true } },
                    },
                    {
                        userEnteredValue: { stringValue: 'Description' },
                        userEnteredFormat: { textFormat: { bold: true } },
                    },
                    {
                        userEnteredValue: { stringValue: 'Word Count' },
                        userEnteredFormat: { textFormat: { bold: true } },
                    },
                    {
                        userEnteredValue: { stringValue: 'Chapter Count' },
                        userEnteredFormat: { textFormat: { bold: true } },
                    },
                    {
                        userEnteredValue: {  stringValue: 'Status' },
                        userEnteredFormat: { textFormat: { bold: true } },
                    },
                    {
                        userEnteredValue: { stringValue: 'Rating' },
                        userEnteredFormat: { textFormat: { bold: true } },
                    },
                ],
            },
        ],
    },
    { startColumn: 0, columnMetadata: { hiddenByUser: true } }, //row number
    { startColumn: 1, columnMetadata: { pixelSize: 75 } }, //work ID
    { startColumn: 2, columnMetadata: { pixelSize: 200 } }, //title
    { startColumn: 3, columnMetadata: { pixelSize: 150 } }, //authors
    { startColumn: 4, columnMetadata: { pixelSize: 200 } }, //fandoms
    { startColumn: 5, columnMetadata: { pixelSize: 200 } }, //relationships
    { startColumn: 6, columnMetadata: { pixelSize: 300 } }, //tags
    { startColumn: 7, columnMetadata: { pixelSize: 300 } }, //description
    { startColumn: 8, columnMetadata: { pixelSize: 100 } }, //word count
    { startColumn: 9, columnMetadata: { pixelSize: 100 } }, //chapter count
    { startColumn: 10, columnMetadata: { pixelSize: 100 } }, //status
    { startColumn: 11, columnMetadata: { pixelSize: 100 } }, //rating
]

/**
 *
 * @returns user's spreadsheet URL
 */
export async function fetchSpreadsheetUrl() {
    log('getting spreadsheet URL');
    return new Promise<string>((resolve, reject) => {
        // check for a stored spreadsheet URL
        chrome.storage.sync.get(['spreadsheetUrl'], async (result) => {
            log('fetchSpreadSheetUrl result: ', result);
            const spreadsheetUrl = result.spreadsheetUrl;
            log('spreadsheetUrl type: ', typeof spreadsheetUrl);
            // does the user have a spreadsheet URL already?
            if (spreadsheetUrl !== undefined && Object.keys(spreadsheetUrl).length !== 0) {
                log('user has spreadsheet URL: ', spreadsheetUrl);
                log('spreadsheetID: ', String(spreadsheetUrl).split('/')[5]);
                resolve(spreadsheetUrl);
            } else {
                log("user doesn't have spreadsheet URL, creating spreadsheet");
                //get authToken
                const token = await retrieveAccessToken();
                if (token === null) {
                    return Promise.reject('Error getting token');
                } else {
                    //create spreadsheet
                    createSpreadsheet(token)
                        .then((url) => {
                            log('spreadsheet URL: ', url);
                            return Promise.resolve(url);
                        })
                        .catch((error) => {
                            return Promise.reject(error);
                        });
                }
            }
        });
    });
}

/**
 *
 * @param token user's auth token
 * @returns spreadsheet URL
 */
export async function createSpreadsheet(token: string) {

    const sheetLayout = {
        properties: { title: 'AO3E' },
        namedRanges: [
            {
                namedRangeId: '0',
                name: 'rowNumber',
                range: {
                    sheetId: 0,
                    startColumnIndex: 0,
                    endColumnIndex: 1
                }
            },
            {
                namedRangeId: '1',
                name: 'WorkId',
                range: {
                    sheetId: 0,
                    startColumnIndex: 1,
                    endColumnIndex: 2
                }
            },
            {
                namedRangeId: '2',
                name: 'title',
                range: {
                    sheetId: 0,
                    startColumnIndex: 2,
                    endColumnIndex: 3
                }
            },
            {
                namedRangeId: '3',
                name: 'authors',
                range: {
                    sheetId: 0,
                    startColumnIndex: 3,
                    endColumnIndex: 4
                }
            },
            {
                namedRangeId: '4',
                name: 'fandoms',
                range: {
                    sheetId: 0,
                    startColumnIndex: 4,
                    endColumnIndex: 5
                }
            },
            {
                namedRangeId: '5',
                name: 'relationships',
                range: {
                    sheetId: 0,
                    startColumnIndex: 5,
                    endColumnIndex: 6
                }
            },
            {
                namedRangeId: '6',
                name: 'tags',
                range: {
                    sheetId: 0,
                    startColumnIndex: 6,
                    endColumnIndex: 7
                }
            },
            {
                namedRangeId: '7',
                name: 'description',
                range: {
                    sheetId: 0,
                    startColumnIndex: 7,
                    endColumnIndex: 8
                }
            },
            {
                namedRangeId: '8',
                name: 'wordCount',
                range: {
                    sheetId: 0,
                    startColumnIndex: 8,
                    endColumnIndex: 9
                }
            },
            {
                namedRangeId: '9',
                name: 'chapterCount',
                range: {
                    sheetId: 0,
                    startColumnIndex: 9,
                    endColumnIndex: 10
                }
            },
            {
                namedRangeId: '10',
                name: 'status',
                range: {
                    sheetId: 0,
                    startColumnIndex: 10,
                    endColumnIndex: 11
                }
            },
            {
                namedRangeId: '11',
                name: 'rating',
                range: {
                    sheetId: 0,
                    startColumnIndex: 11,
                    endColumnIndex: 12
                }
            }

        ],
        sheets: [
            {
                properties: {
                    title: 'SavedWorks',
                    sheetId: 0
                },
                protectedRanges: [
                    {
                        protectedRangeId: 0,
                        range: {},
                        description: 'Protected',
                        warningOnly: true,
                    },
                ],
                data: headerRowData,
            },
        ],          
    };


    const sheet = await makeRequest({
        url: 'https://sheets.googleapis.com/v4/spreadsheets',
        method: HttpMethod.POST,
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
        body: sheetLayout
    })
        .then((response) => {
            log('Response status:', response.status);
            return response.json();
        })
        .then(async (data) => {
            if(data.error) {
                log('Error creating spreadsheet:', data.error);
                throw new Error(data.error.message);
            }
            log('Successfully created:', data);
            await syncStorageSet('spreadsheetUrl', data.spreadsheetUrl)
            .then(() => { return data.body; });
        })
        .catch((error) => {
            log('Error creating spreadsheet:', error);
            throw error;
        });
    return sheet;
}
