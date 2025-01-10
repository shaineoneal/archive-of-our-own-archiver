import { Ao3_BaseWork } from "../../pages/content-script";
import { HttpMethod, makeRequest } from "./httpRequest";
import log from "../logger";


export const removeWorkFromSheet = async (spreadsheetId: string, accessT: string, workId: number) => {
    const response = await createFilterView(spreadsheetId, accessT, workId);
    log('removeWorkFromSheet', response);
    if(response) {
        await deleteWork(spreadsheetId, accessT, workId);
    }

}
const createFilterView = async (spreadsheetId: string, accessT: string, workId: number) => {
    const filterView = {
        filter: {
            range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 10000,
                startColumnIndex: 0,
                endColumnIndex: 10
            },
            filterSpecs: [
                {
                    filterCriteria: {
                        condition: {
                            type: 'NUMBER_EQ',
                            values: [{ userEnteredValue: `${workId}` }]
                        }
                    },
                    columnIndex: 0
                }
            ]
        }
    }

    const response = await makeRequest({
        url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
        method: HttpMethod.POST,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessT}`,
        },
        body: {
            requests: [
                {
                    setBasicFilter: filterView
                }
            ],
            includeSpreadsheetInResponse: true,
            responseIncludeGridData: true
        }
    });

    const parsedResponse = await response.json();

    log('removeWorkFromSheet', 'response', parsedResponse);
    //log('replies', parsedResponse.replies);
    return !!parsedResponse.updatedSpreadsheet.sheets[0].data[0].rowData[1];

}

const deleteWork = async (spreadsheetId: string, accessT: string, workId: number) => {
    await makeRequest({
        url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
        method: HttpMethod.POST,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessT}`,
        },
        body: {
            requests: [
                {
                    setBasicFilter: {
                        filter: {
                            range: {
                                sheetId: 0,
                                startRowIndex: 0,
                                endRowIndex: 10000,
                                startColumnIndex: 0,
                                endColumnIndex: 10
                            }
                        },
                        filterSpecs: [
                            {
                                columnIndex: 0,
                                filterCriteria: {
                                    condition: {
                                        type: 'NUMBER_EQ',
                                        values: [{userEnteredValue: `${workId}`}]
                                    }
                                }
                            },
                        ]
                    }
                }
            ],
        }
    });
}