import log from '../logger';
import { HttpMethod, HttpResponse, makeRequest } from "./httpRequest";

export async function querySpreadsheet(spreadsheetId: string, authToken: string, searchList: number[]) {
    
    let query = createEncodedQuery(searchList);

    const response = await makeRequest({
        url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tq=${query}&access_token=${authToken}`,
        method: HttpMethod.GET,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
    })

    return parseResponse(response);
}

function createEncodedQuery(searchList: number[]): string {
    let query = `select A where A matches`;
    searchList.forEach((workId) => {
        if (workId === searchList[0]) {
            query += ` '${workId}'`;
        } else {
            query += ` or A matches '${workId}'`;
        }
    });
    return encodeURIComponent(query);
}

async function parseResponse(response: HttpResponse) {
    log('parseResponse', 'response', response);
    let data = await response.text();
    return JSON.parse(data.substring(47, data.length - 2));
}