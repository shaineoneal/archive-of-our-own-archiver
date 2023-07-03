import { fetchToken } from '.';
import { log } from '../utils';

/**
 *
 * @returns user's spreadsheet URL
 */
export function fetchSpreadsheetUrl() {
    log('getting spreadsheet URL');
    return new Promise<string>((resolve, reject) => {
        // check for a stored spreadsheet URL
        chrome.storage.sync.get(['spreadsheetUrl'], async (result) => {
            const spreadsheetUrl = result.spreadsheetUrl;

            // does the user have a spreadsheet URL already?
            if (spreadsheetUrl !== undefined) {
                log('user has spreadsheet URL: ', spreadsheetUrl);
                log('spreadsheetID: ', spreadsheetUrl.split('/')[5]);
                resolve(spreadsheetUrl);
            } else {
                log("user doesn't have spreadsheet URL, creating spreadsheet");
                //get authToken
                const token = await fetchToken();
                if (token === null) {
                    reject('Error getting token');
                } else {
                    //create spreadsheet
                    await createSpreadsheet(token)
                        .then((url) => {
                            resolve(url);
                        })
                        .catch((error) => {
                            reject(error);
                        });
                }
            }
        });
    });
}

/**
 *
 * @param token user's auth token
 * @returns
 */
async function createSpreadsheet(token: string) {
    const title = 'AO3E';
    const spreadsheetName = 'Saved Works';

    const sheetLayout = {
        properties: { title: title },
        sheets: {
            properties: { title: spreadsheetName },
            data: [
                {
                    startRow: 0,
                    startColumn: 0,
                    rowData: [
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
                                    userEnteredValue: { stringValue: 'Status' },
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

    const url = 'https://sheets.googleapis.com/v4/spreadsheets';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(sheetLayout),
    };

    return fetch(url, options)
        .then((response) => {
            log('Response status:', response.status);
            return response.json();
        })
        .then((data) => {
            log('Success:', data);
            chrome.storage.sync.set({ spreadsheetUrl: data.spreadsheetUrl });
            return data.spreadsheetUrl;
        })
        .catch((error) => {
            log('Error creating spreadsheet:', error);
            throw error;
        });
}
