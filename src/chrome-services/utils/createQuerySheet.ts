const query = (searchList: string[] | string) => {

    let queryVal = `select B where B matches`;

    //if searchList is a number, it is a single work
    if (typeof searchList === 'number') {
        queryVal += ` '${searchList}'`;
    }
    
    //if searchList is an array, it is a list of works
    else if (Array.isArray(searchList)) {
        searchList.forEach((workId) => {
            //if its the first work, dont add an or
            if (workId === searchList[0]) {
                queryVal += ` '${workId}'`;
            } else {
                queryVal += ` or B matches '${workId}'`;
            }
        });
    }

    return queryVal;
} 
export const newQuerySheet = (searchList: string[] | string) => { 
    return JSON.stringify({
        requests: [
            {
                addSheet: {

                },
                updateCells: {
                    range: {
                        sheetId: 'query',
                        startRowIndex: 0,
                        endRowIndex: 1,
                        startColumnIndex: 0,
                        endColumnIndex: 1,
                    },
                    rows: [
                        {
                            values: [
                                {
                                    userEnteredValue: {
                                        stringValue: '=QUERY(A1:A, "max(A)")',
                                    },
                                },
                            ],
                        },
                        {
                            values: [
                                {
                                    userEnteredValue: {
                                        stringValue: query(searchList),
                                    },
                                },
                            ],
                        },
                    ],
                    fields: 'userEnteredValue',
                },
            }
        ],
        includeSpreadsheetInResponse: true,
        responseRanges: [ 'query!A1:A2' ],
    }); 
}


