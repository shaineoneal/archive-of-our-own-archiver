import log from '../utils/logger';

/**
 *
 * @param token user's auth token
 * @returns
 */
export async function createSpreadsheet(token: string) {

    const url = 'https://sheets.googleapis.com/v4/spreadsheets';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(sheetLayout),
    };

    log ('options: ', options);

    return fetch(url, options)
        .then((response) => {
            log('Response status:', response.status);
            return response.json();
        })
        .then((data) => {
            log('Success:', data);
            return data.spreadsheetId;
        })
        .catch((error) => {
            log('Error creating spreadsheet:', error);
            throw error;
        });
}

const sheetLayout = {
    properties: { title: 'AO3E' },
    namedRanges: [
        {
            namedRangeId: '0',
            name: 'WorkID',
            range: {
                sheetId: 0,
                startColumnIndex: 0,
                endColumnIndex: 1
            }
        },
        {
            namedRangeId: '1',
            name: 'title',
            range: {
                sheetId: 0,
                startColumnIndex: 1,
                endColumnIndex: 2
            }
        },
        {
            namedRangeId: '2',
            name: 'authors',
            range: {
                sheetId: 0,
                startColumnIndex: 2,
                endColumnIndex: 3
            }
        },
        {
            namedRangeId: '3',
            name: 'fandoms',
            range: {
                sheetId: 0,
                startColumnIndex: 3,
                endColumnIndex: 4
            }
        },
        {
            namedRangeId: '4',
            name: 'relationships',
            range: {
                sheetId: 0,
                startColumnIndex: 4,
                endColumnIndex: 5
            }
        },
        {
            namedRangeId: '5',
            name: 'tags',
            range: {
                sheetId: 0,
                startColumnIndex: 5,
                endColumnIndex: 6
            }
        },
        {
            namedRangeId: '6',
            name: 'description',
            range: {
                sheetId: 0,
                startColumnIndex: 6,
                endColumnIndex: 7
            }
        },
        {
            namedRangeId: '7',
            name: 'wordCount',
            range: {
                sheetId: 0,
                startColumnIndex: 7,
                endColumnIndex: 8
            }
        },
        {
            namedRangeId: '8',
            name: 'chapterCount',
            range: {
                sheetId: 0,
                startColumnIndex: 8,
                endColumnIndex: 9
            }
        },
        {
            namedRangeId: '9',
            name: 'status',
            range: {
                sheetId: 0,
                startColumnIndex: 9,
                endColumnIndex: 10
            }
        },
        {
            namedRangeId: '10',
            name: 'rating',
            range: {
                sheetId: 0,
                startColumnIndex: 10,
                endColumnIndex: 11
            }
        }

    ],
    sheets: {
        properties: {
            title: 'Access Works',
            sheetId: 0,
            /*gridProperties: {
                rowCount: 1,
                columnCount: 11,
                columnGroupControlAfter: true,
            }*/
        },
        protectedRanges: [
            {
                protectedRangeId: 0,
                range: {},
                description: 'Protected',
                warningOnly: true,
            },
        ],        
        data: [
            {
                startRow: 0,
                startColumn: 0,
                rowData:  [
                    {
                        values: [
                            {
                                userEnteredValue: {
                                    stringValue: 'Work ID',
                                },
                                userEnteredFormat: {
                                    textFormat: { bold: true },
                                },
                            },
                            {
                                userEnteredValue: { stringValue: 'Title' },
                                userEnteredFormat: {
                                    textFormat: { bold: true },
                                },
                            },
                            {
                                userEnteredValue: {
                                    stringValue: 'Authors',
                                },
                                userEnteredFormat: {
                                    textFormat: { bold: true },
                                },
                            },
                            {
                                userEnteredValue: {
                                    stringValue: 'Fandoms',
                                },
                                userEnteredFormat: {
                                    textFormat: { bold: true },
                                },
                            },
                            {
                                userEnteredValue: {
                                    stringValue: 'Relationships',
                                },
                                userEnteredFormat: {
                                    textFormat: { bold: true },
                                },
                            },
                            {
                                userEnteredValue: {
                                    stringValue: 'Tags',
                                },
                                userEnteredFormat: {
                                    textFormat: { bold: true },
                                },
                            },
                            {
                                userEnteredValue: {
                                    stringValue: 'Description',
                                },
                                userEnteredFormat: {
                                    textFormat: { bold: true },
                                },
                            },
                            {
                                userEnteredValue: {
                                    stringValue: 'Word Count',
                                },
                                userEnteredFormat: {
                                    textFormat: { bold: true },
                                },
                            },
                            {
                                userEnteredValue: {
                                    stringValue: 'Chapter Count',
                                },
                                userEnteredFormat: {
                                    textFormat: { bold: true },
                                },
                            },
                            {
                                userEnteredValue: { 
                                    stringValue: 'Status' 
                                },
                                userEnteredFormat: {
                                    textFormat: { bold: true },
                                },
                            },
                            {
                                userEnteredValue: {
                                    stringValue: 'Rating',
                                },
                                userEnteredFormat: {
                                    textFormat: { bold: true },
                                },
                            },
                        ],
                    },
                ],
            },
            { startColumn: 0, columnMetadata: { pixelSize: 100 } }, //work ID
            { startColumn: 1, columnMetadata: { pixelSize: 300 } }, //title
            { startColumn: 2, columnMetadata: { pixelSize: 200 } }, //authors
            { startColumn: 3, columnMetadata: { pixelSize: 200 } }, //fandoms
            { startColumn: 4, columnMetadata: { pixelSize: 100 } }, //word count
            { startColumn: 5, columnMetadata: { pixelSize: 100 } }, //chapter count
            { startColumn: 6, columnMetadata: { pixelSize: 100 } }, //status
        ],
    },
};