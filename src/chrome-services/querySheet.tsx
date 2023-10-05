import { log } from '../utils';

export async function query(spreadsheetUrl: string, authToken: string, searchList: number[]): Promise<any>;
export async function query(spreadsheetUrl: string, authToken: string, work: number): Promise<any>;



// query the spreadsheet for the works in the searchList
export async function query(spreadsheetUrl: string, authToken: string, searchList: unknown): Promise<unknown> {
    
    let query = `select A where A matches`;

    log('query', 'searchList', searchList);

    //if searchList is a number, it is a single work
    if (typeof searchList === 'number') {
        query += ` '${searchList}'`;

    }
    //if searchList is an array, it is a list of works
    else if (Array.isArray(searchList)) {
        searchList.forEach((workId) => {
            //if its the first work, dont add an or
            if (workId === searchList[0]) {
                query += ` '${workId}'`;
            } else {
                query += ` or A matches '${workId}'`;
            }
        });
    }

    encodeURIComponent(query);

    log('query', encodeURIComponent(query));
    return fetch(
        `https://docs.google.com/spreadsheets/d/${spreadsheetUrl.split('/')[5]}/gviz/tq?tq=${encodeURIComponent(query)}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
            },
        }).then((res) => res.text()).then((res) => {
            log('query', 'res', res);
            const json = JSON.parse(res.substring(47, res.length - 2));
            log('query', 'json', json);
            return json;
        });
}

