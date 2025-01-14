import log from '../logger';
import { HttpMethod, HttpResponse, makeRequest } from "./httpRequest";
import { setStore, StoreMethod } from "./store";

export async function querySpreadsheet(spreadsheetId: string, authToken: string, searchList: number[]) {

    let query = createEncodedQuery(searchList);
    log('querySpreadsheet', 'authToken', authToken);
    //const response = await makeRequest({
    //    url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?&tq=${query}`,
    //    method: HttpMethod.GET,
    //    headers: {
    //        'Content-Type': 'application/json',
    //        Authorization: `Bearer ${authToken}`,
    //    },
    //})

    const response = await makeRequest({
        url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet`,
        method: HttpMethod.GET,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
        body: {
            ranges: searchList.map((workId) => `Sheet1!A${workId}:O${workId}`),
            majorDimension: 'ROWS',
        }
    })
    const parsed = await parseResponse(response);
    log('querySpreadsheet', 'parsed', parsed);
    return parsed;
}

/**
 * Creates an encoded query string for the Google Sheets API.
 *
 * @param {number[]} searchList - List of work IDs to search for.
 * @returns {string} - The encoded query string.
 */
function createEncodedQuery(searchList: number[]): string {
    // Initialize the query string with the desired columns to select
    let query = `select A, B, K, L, M, N, O, P where B matches`;

    // Iterate over each work ID in the search list
    searchList.forEach((workId) => {
        // For the first work ID, add it directly to the query
        if (workId === searchList[0]) {
            query += ` '${workId}'`;
        } else {
            // For subsequent work IDs, append them with 'or' condition
            query += ` or B matches '${workId}'`;
        }
    });

    // Encode the query string to be URL-safe
    return encodeURIComponent(query);
}

async function parseResponse(response: HttpResponse): Promise<any> {
    log('parseResponse', 'response', response);
    let data = await response.text();
    return JSON.parse(data.substring(47, data.length - 2));
}