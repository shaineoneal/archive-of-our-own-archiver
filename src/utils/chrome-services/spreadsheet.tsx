import log from '../logger';
import {HttpMethod, makeRequest} from "./httpRequest";

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

    return fetch(url, options)      //TODO: change to makeRequest
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
            namedRangeId: '1',
            name: 'index',
            range: {
                sheetId: 0,
                startColumnIndex: 0,
                endColumnIndex: 1
            }
        },
        {
            namedRangeId: '2',
            name: 'WorkID',
            range: {
                sheetId: 0,
                startColumnIndex: 1,
                endColumnIndex: 2
            }
        },
        {
            namedRangeId: '3',
            name: 'title',
            range: {
                sheetId: 0,
                startColumnIndex: 2,
                endColumnIndex: 3
            }
        },
        {
            namedRangeId: '4',
            name: 'authors',
            range: {
                sheetId: 0,
                startColumnIndex: 3,
                endColumnIndex: 4
            }
        },
        {
            namedRangeId: '5',
            name: 'fandoms',
            range: {
                sheetId: 0,
                startColumnIndex: 4,
                endColumnIndex: 5
            }
        },
        {
            namedRangeId: '6',
            name: 'relationships',
            range: {
                sheetId: 0,
                startColumnIndex: 5,
                endColumnIndex: 6
            }
        },
        {
            namedRangeId: '7',
            name: 'tags',
            range: {
                sheetId: 0,
                startColumnIndex: 6,
                endColumnIndex: 7
            }
        },
        {
            namedRangeId: '8',
            name: 'description',
            range: {
                sheetId: 0,
                startColumnIndex: 7,
                endColumnIndex: 8
            }
        },
        {
            namedRangeId: '9',
            name: 'wordCount',
            range: {
                sheetId: 0,
                startColumnIndex: 8,
                endColumnIndex: 9
            }
        },
        {
            namedRangeId: '10',
            name: 'chapterCount',
            range: {
                sheetId: 0,
                startColumnIndex: 9,
                endColumnIndex: 10
            }
        },
        {
            namedRangeId: '11',
            name: 'status',
            range: {
                sheetId: 0,
                startColumnIndex: 10,
                endColumnIndex: 11
            }
        },
        {
            namedRangeId: '12',
            name: 'history',
            range: {
                sheetId: 0,
                startColumnIndex: 11,
                endColumnIndex: 12
            }
        },
        {
            namedRangeId: '13',
            name: 'personalTags',
            range: {
                sheetId: 0,
                startColumnIndex: 12,
                endColumnIndex: 13
            }
        },
        {
            namedRangeId: '14',
            name: 'rating',
            range: {
                sheetId: 0,
                startColumnIndex: 13,
                endColumnIndex: 14
            }
        },
        {
            namedRangeId: '15',
            name: 'readCount',
            range: {
                sheetId: 0,
                startColumnIndex: 14,
                endColumnIndex: 15
            }
        },
        {
            namedRangeId: '16',
            name: 'skipReason',
            range: {
                sheetId: 0,
                startColumnIndex: 15,
                endColumnIndex: 16
            }
        }

    ],
    sheets: {
        properties: {
            title: 'Access Works',
            sheetId: 0,
            gridProperties: {
                rowCount: 1,
                columnCount: 16,
                columnGroupControlAfter: true,
            }
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
                                    stringValue: 'Index',
                                },
                                userEnteredFormat: {
                                    textFormat: { bold: true },
                                },
                            },
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
                                    stringValue: 'History',
                                },
                                userEnteredFormat: {
                                    textFormat: { bold: true },
                                },
                            },
                            {
                                userEnteredValue: {
                                    stringValue: 'Personal Tags',
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
                            {
                                userEnteredValue: {
                                    stringValue: 'Read Count',
                                },
                                userEnteredFormat: {
                                    textFormat: { bold: true },
                                },
                            },
                            {
                                userEnteredValue: {
                                    stringValue: 'Skip Reason',
                                },
                                userEnteredFormat: {
                                    textFormat: { bold: true },
                                },
                            },
                        ],
                    },
                ],
            },
            { startColumn: 1, columnMetadata: { pixelSize: 100 } }, //work ID
            { startColumn: 2, columnMetadata: { pixelSize: 200 } }, //title
            { startColumn: 3, columnMetadata: { pixelSize: 200 } }, //authors
            { startColumn: 4, columnMetadata: { pixelSize: 200 } }, //fandoms
            { startColumn: 5, columnMetadata: { pixelSize: 200 } }, //relationships
            { startColumn: 6, columnMetadata: { pixelSize: 200 } }, //tags
            { startColumn: 7, columnMetadata: { pixelSize: 300 } }, //description
            { startColumn: 8, columnMetadata: { pixelSize: 100 } }, //word count
            { startColumn: 9, columnMetadata: { pixelSize: 100 } }, //chapter count
            { startColumn: 10, columnMetadata: { pixelSize: 100 } }, //status
            { startColumn: 11, columnMetadata: { pixelSize: 300 } }, //history
            { startColumn: 12, columnMetadata: { pixelSize: 200 } }, //personal tags
            { startColumn: 13, columnMetadata: { pixelSize: 100 } }, //rating
            { startColumn: 14, columnMetadata: { pixelSize: 100 } }, //read count
            { startColumn: 15, columnMetadata: { pixelSize: 200 } }, //skip reason
        ],
    },
};