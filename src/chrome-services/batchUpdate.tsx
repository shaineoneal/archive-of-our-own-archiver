import { log } from '../utils/';
import { getSheetId } from './getSheetId';
import { Work } from '../works';
import { AppendCellsRequest } from '../types/AppendCellsRequest';
import { RowData } from '../types/RowData';

function createRequest(work: Work): string {
    const req: string = JSON.stringify({
        values: [
            { userEnteredValue: { numberValue: work.workId } },
            { userEnteredValue: { stringValue: work.title } },
            { userEnteredValue: { stringValue: work.author.toString() } },
            { userEnteredValue: { stringValue: work.fandoms.toString() } },
            { userEnteredValue: { numberValue: work.wordCount } },
            { userEnteredValue: { numberValue: work.totalChapters } },
            { userEnteredValue: { stringValue: work.status } },
        ],
    });
    log('obj', req);
    return req;
}

export const batchUpdate = async (spreadsheetUrl: string, authToken: string, work: Work) => {;
    log('batchUpdate', work);
    log('batchUpdate', createRequest(work).toString());

    const sheetId: number = await getSheetId(spreadsheetUrl, authToken);
    log('batchUpdate', 'sheetId', sheetId);

    return fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetUrl.split('/')[5]}:batchUpdate`,
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
            requests: [
                {
                    appendCells: {
                        sheetId: sheetId,
                        rows: [
                            { values: [
                                { userEnteredValue: { numberValue: work.workId } },
                                { userEnteredValue: { stringValue: work.title } },
                                { userEnteredValue: { stringValue: work.author.toString() } },
                                { userEnteredValue: { stringValue: work.fandoms.toString() } },
                                { userEnteredValue: { numberValue: work.wordCount } },
                                { userEnteredValue: { numberValue: work.totalChapters } },
                                { userEnteredValue: { stringValue: work.status } },
                            ] },
                        ], 
                        fields: '*',
                    }
                }
            ],
            includeSpreadsheetInResponse: false
        }),
    }
    ).then((res) => res.json());
}

    