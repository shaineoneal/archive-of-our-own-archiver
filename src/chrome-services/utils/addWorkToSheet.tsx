import { log } from '../../utils';
import { Work } from '../../works';
import { getSheetId } from './getSheetId';


export const addWorkToSheet = async (spreadsheetUrl: string, authToken: string, work: Work) => {;
    log('addWorkToSheet', work);

    const sheetId: number = await getSheetId(spreadsheetUrl, authToken);
    log('addWorkToSheet', 'sheetId', sheetId);

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

    