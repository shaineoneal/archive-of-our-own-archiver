import { log } from '../../utils';
import { BaseWork } from '../../works/BaseWork';
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

    
//need to use values.append so row can be attached to ao3 blurb
export const ALTaddWorkToSheet = async (spreadsheetUrl: string, authToken: string, work: BaseWork) => {;
    log('addWorkToSheet', work);

    const sheetId: number = await getSheetId(spreadsheetUrl, authToken);
    log('addWorkToSheet', 'sheetId', sheetId);

    return fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetUrl.split('/')[5]}/values/SavedWorks!A1:K1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
            'range': 'SavedWorks!A1:K1',
            'majorDimension': 'ROWS',
            'values': [
                [
                    work.workId,                        //A
                    work.title,                         //B
                    work.author.toString(),             //C 
                    work.fandoms.toString(),            //D
                    work.relationships.toString(),      //E
                    work.tags.toString(),               //F
                    work.description,                   //G
                    work.wordCount,                     //H
                    work.totalChapters,                 //I
                    work.status,                        //J
                    work.rating,                        //K
                ],  
            ],
        }),
    }
    ).then((res) => res.json());
}

export const getRowFromResponse = (response: any) => {
    log('getRowFromResponse', response);
    return response.updates.updatedRange.split('!')[1].split(':')[0][1];
}