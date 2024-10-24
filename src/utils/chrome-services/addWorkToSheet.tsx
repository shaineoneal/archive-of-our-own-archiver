import { BaseWork } from '../../pages/content-script/BaseWork';
import log from '../logger';
import { getSheetId } from './getSheetId';


export const addWorkToSheet = async (spreadsheetUrl: string, authToken: string, work: BaseWork) => {;
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
                    appendDimension: {
                        sheetId: sheetId,
                        dimension: 'ROWS',
                        length: 1,
                    } 
                },
                {
                    appendCells: {
                        sheetId: sheetId,
                        rows: [
                            { values: [
                                { userEnteredValue: { numberValue: work.workId } },                     //0
                                { userEnteredValue: { stringValue: work.title } },                      //1
                                { userEnteredValue: { stringValue: work.author.toString() },
                                    userEnteredFormat: { wrapStrategy: 'WRAP' } },                      //2   
                                { userEnteredValue: { stringValue: work.fandoms.toString() },
                                    userEnteredFormat: { wrapStrategy: 'WRAP' } },                      //3
                                { userEnteredValue: { stringValue: work.relationships.toString() },
                                    userEnteredFormat: { wrapStrategy: 'WRAP' } },                      //4
                                { userEnteredValue: { stringValue: work.tags.toString() },
                                    userEnteredFormat: { wrapStrategy: 'WRAP' } },                      //5
                                { userEnteredValue: { stringValue: work.description },
                                    userEnteredFormat: { wrapStrategy: 'WRAP' } },                      //6
                                { userEnteredValue: { numberValue: work.wordCount } },                  //7   
                                { userEnteredValue: { numberValue: work.totalChapters } },              //8
                                { userEnteredValue: { stringValue: work.status } },                     //9
                                { userEnteredValue: { numberValue: work.rating } },                     //10
                            ] },
                        ], 
                        fields: '*',
                    }
                },
                {
                    autoResizeDimensions: {
                        dimensions: {
                            sheetId: sheetId,
                            dimension: 'ROWS'
                        }
                    }
                }                
            ],
            includeSpreadsheetInResponse: false
        }),
    }
    ).then((res) => res.json());
}

    