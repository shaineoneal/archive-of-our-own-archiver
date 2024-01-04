import { log } from '../../utils';
import { postRequest } from '../httpsRequest';

const worksQuery = (searchList: string[] | string) => {

    let queryVal = `"select B where B matches`;

    //if searchList is a number, it is a single work
    if (typeof searchList === 'number') {
        queryVal += ` '${searchList}'`;
    }
    
    //if searchList is an array, it is a list of works
    else if (Array.isArray(searchList)) {
        searchList.forEach((workId) => {
            //if its the first work, dont add an 'or'
            if (workId === searchList[0]) {
                queryVal += ` '${workId}'`;
            } else {
                queryVal += ` or B matches '${workId}'`;
            }
        });
    }

    queryVal += `"`;

    return queryVal;
} 

const querySheetBody = (searchList: string[] | string) => { 
    return {
        requests: [
            {
                deleteSheet: {
                    sheetId: 1,
                },
            },
            {
                addSheet: {
                    properties: {
                        title: 'Query',
                        sheetId: 1,
                    }
                },
            },
            {
                updateCells: {
                    range: {
                        sheetId: 1,
                        startRowIndex: 0,
                        endRowIndex: 2,
                        startColumnIndex: 0,
                        endColumnIndex: 2,
                    },
                    rows: [
                        {
                            values: [
                                {
                                    userEnteredValue: {
                                        formulaValue: '=QUERY(SavedWorks!A1:A, "select max(A)")',
                                    },
                                },
                                {
                                    userEnteredValue: {
                                        formulaValue: '=QUERY(SavedWorks!B1:B, ' + worksQuery(searchList) + ')',
                                    },
                                },
                            ],
                        },
                    ],
                    fields: '*',
                },
            }
        ],
        includeSpreadsheetInResponse: true,
        responseIncludeGridData: true,
        //responseRanges: [ 'query!A2:B2' ],
    }; 
}

export function addQuerySheet(spreadsheetUrl: string, token: string, searchList: string[] | string): Promise<any> {
    log('addQuerySheet', querySheetBody(searchList));
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetUrl.split('/')[5]}:batchUpdate`;
    const body = querySheetBody(searchList);
    return postRequest(url, body, token);
}

export function getValsFromQuerySheet(response: any) {
    const rowNumber: number = response.updatedSpreadsheet.sheets[1].data[0].rowData[1].values[0].effectiveValue.numberValue;
    const firstWorkNum = response.updatedSpreadsheet.sheets[1].data[0].rowData[1].values[1];

    var workList: string[] = [];
    log('first workList', typeof workList, workList);
    workList.length = 0;      //seems redundant, but it's not
    log('second workList', typeof workList, workList);
    if (firstWorkNum) {
        for (let i = 1; i < response.updatedSpreadsheet.sheets[0].data[0].rowData.length; i++) {
            workList.push(response.updatedSpreadsheet.sheets[0].data[0].rowData[i].values[1].formattedValue);
        }
    }

    
    log('workList', workList);

    global.LASTROW = rowNumber;
    return { rowNumber, workList };
}
