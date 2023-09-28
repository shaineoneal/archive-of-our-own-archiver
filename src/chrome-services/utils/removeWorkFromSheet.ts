import { log } from '../../utils';
import { BaseWork } from '../../works/BaseWork';
import { getSheetId } from './getSheetId';


export const removeWorkFromSheet = async (spreadsheetUrl: string, authToken: string, work: BaseWork) => {;
    log('removeWorkFromSheet', work);

    const sheetId: number = await getSheetId(spreadsheetUrl, authToken);
    log('removeWorkFromSheet', 'sheetId', sheetId);

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
                    setBasicFilter: {
                        filter: {
                            range: {
                                sheetId: sheetId,
                            },
                            filterSpecs: [
                                {
                                    columnIndex: 0,
                                    filterCriteria: {
                                        condition: {
                                            type: 'NUMBER_EQ',
                                            values: [
                                                {
                                                    userEnteredValue: work.workId.toString(),
                                                },
                                            ],
                                        },
                                    },
                                },
                            ],
                        }
                    }
                },
                {
                    deleteDimension: {
                        range: {
                            sheetId: sheetId,
                            dimension: 'ROWS',
                            startIndex: 0,
                            endIndex: 1,
                        },
                    },
                },
                {
                    clearBasicFilter: {
                        sheetId: sheetId
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

    