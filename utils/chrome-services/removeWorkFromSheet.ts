import { log } from "@/utils/logger.ts";
import { HttpMethod, makeRequest } from "./httpRequest.ts";


export const removeWorkFromSheet = async (spreadsheetId: string, accessT: string, workId: number): Promise<boolean> => {

    
    const resp = await deleteWork(spreadsheetId, accessT, workId);
    log('removeWorkFromSheet', JSON.stringify(resp));
    return resp;
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

const deleteWork = async (spreadsheetId: string, accessT: string, workIndex: number): Promise<boolean> => {
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
                    deleteDimension: {
                        range: {
                            sheetId: 0,
                            dimension: 'ROWS',
                            startIndex: workIndex - 1,
                            endIndex: workIndex
                        }
                    }
                }
            ],
        }
    });
    log('deleteWork', response);
    log('deleteWork', await response.json());
    

    return response.ok;
}