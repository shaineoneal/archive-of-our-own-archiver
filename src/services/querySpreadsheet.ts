import { HttpMethod, HttpResponse, makeRequest } from './httpRequest.ts';
import type { GvizDataTableResponse } from '@/types/gvizDataTable.ts';

export async function querySpreadsheet(spreadsheetId: string, authToken: string, searchList: string[]): Promise<GvizDataTableResponse> {
    let query = createEncodedQuery(searchList);

    const response = await makeRequest({
        url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tq=${query}&access_token=${authToken}`,
        method: HttpMethod.GET,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return await parseResponse(response);
}

function createEncodedQuery(searchList: string[]): string {
    let query = 'select * where B matches';
    searchList.forEach((workId) => {
        if (workId === searchList[0]) {
            query += ` '${workId}'`;
        } else {
            query += ` or B matches '${workId}'`;
        }
    });
    return encodeURIComponent(query);
}

async function parseResponse(response: HttpResponse): Promise<GvizDataTableResponse> {
    logger.debug('parseResponse', 'response', response);
    let data = await response.text();
    const item = JSON.parse(data.substring(47, data.length - 2));
    if (item.status === 'error') {
        logger.error('Error response from Google Visualization API:', item);
        throw new Error(`Google Visualization API error: ${item.errors?.[0]?.detailed_message || 'Unknown error'}`);
    }
    return JSON.parse(data.substring(47, data.length - 2)) as GvizDataTableResponse;
}