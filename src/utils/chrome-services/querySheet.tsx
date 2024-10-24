import log from '../logger';

// query the spreadsheet for the works in the searchList
export async function query(spreadsheetUrl: string, authToken: string, searchList: number[]) {
    
    let query = `select A where A matches`;
    searchList.forEach((workId) => {
        if (workId === searchList[0]) {
            query += ` '${workId}'`;
        } else {
            query += ` or A matches '${workId}'`;
        }
    });

    encodeURIComponent(query);

    log('query', encodeURIComponent(query));
    return fetch(
        `https://docs.google.com/spreadsheets/d/${spreadsheetUrl.split('/')[5]}/gviz/tq?tq=${encodeURIComponent(query)}&access_token=${authToken}`,
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
