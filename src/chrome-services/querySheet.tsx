import { log } from '../utils';

// listQuery the spreadsheet for the works in the searchList
export async function listQuery(spreadsheetUrl: string, authToken: string, searchList: number[]) {

    let query = `select A where A matches`;
    searchList.forEach((workId) => {
        if (workId === searchList[0]) {
            query += ` '${workId}'`;
        } else {
            query += ` or A matches '${workId}'`;
        }
    });

    encodeURIComponent(query);

    log('listQuery', encodeURIComponent(query));
    return fetch(
        `https://docs.google.com/spreadsheets/d/${spreadsheetUrl.split('/')[5]}/gviz/tq?tq=${encodeURIComponent(query)}&access_token=${authToken}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
            },
        }).then((res) => res.text()).then((res) => {
            log('listQuery', 'res', res);
            const json = JSON.parse(res.substring(47, res.length - 2));
            log('listQuery', 'json', json);
            return json;
        });
}

export async function workQuery(spreadsheetUrl: string, authToken: string, workId: number) {
    let query = `select A where A matches ${workId}`;

    encodeURIComponent(query);

    log('listQuery', encodeURIComponent(query));
    return fetch(
        `https://docs.google.com/spreadsheets/d/${spreadsheetUrl.split('/')[5]}/gviz/tq?tq=${encodeURIComponent(query)}&access_token=${authToken}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
            },
        }).then((res) => res.text()).then((res) => {
        log('listQuery', 'res', res);
        const json = JSON.parse(res.substring(47, res.length - 2));
        log('listQuery', 'json', json);
        return json;
    });
}