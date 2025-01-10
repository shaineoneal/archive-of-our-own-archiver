import log from '../logger';
import { HttpMethod, HttpResponse, makeRequest } from "./httpRequest";

export async function querySpreadsheet(spreadsheetId: string, authToken: string, searchList: number[]) {

    let query = createEncodedQuery(searchList);

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

    return parseResponse(response);
}

function createEncodedQuery(searchList: number[]): string {
    let query = `select A, J, K, L, M, N, O where A matches`;
    searchList.forEach((workId) => {
        if (workId === searchList[0]) {
            query += ` '${workId}'`;
        } else {
            query += ` or A matches '${workId}'`;
        }
    });
    return encodeURIComponent(query);
}

async function parseResponse(response: HttpResponse): Promise<any> {
    log('parseResponse', 'response', response);
    let data = await response.text();
    return JSON.parse(data.substring(47, data.length - 2));
}