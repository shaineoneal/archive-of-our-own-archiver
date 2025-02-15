import { log } from '@/utils/logger.ts';
import { HttpMethod, HttpResponse, makeRequest } from "./httpRequest.ts";

export async function querySpreadsheet(spreadsheetId: string, authToken: string, searchList: number[]) {

    let query = createEncodedQuery(searchList);

    const response = await makeRequest({
        url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tq=${query}&access_token=${authToken}`,
        method: HttpMethod.GET,
        headers: {
            'Content-Type': 'application/json',
        }
    })

    return await parseResponse(response);
}

function createEncodedQuery(searchList: number[]): string {
    let query = `select A, B, K, L, M, N, O, P where B matches`;
    searchList.forEach((workId) => {
        if (workId === searchList[0]) {
            query += ` '${workId}'`;
        } else {
            query += ` or B matches '${workId}'`;
        }
    });
    return encodeURIComponent(query);
}

async function parseResponse(response: HttpResponse): Promise<any> {
    log('parseResponse', 'response', response);
    let data = await response.text();
    return JSON.parse(data.substring(47, data.length - 2));
}