import { log } from '../utils';

export async function query(spreadsheetUrl: string, authToken: string, searchList: number[]): Promise<any>;
export async function query(spreadsheetUrl: string, authToken: string, work: number): Promise<any>;

// TODO: switch the entire thing to a spreadsheets.values.get request instead

// query the spreadsheet for the works in the searchList
export async function query(spreadsheetUrl: string, authToken: string, searchList: unknown) {
    
    let query = `select B where B matches`;

    log('query', 'count', searchList);

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
                query += ` or B matches '${workId}'`;
            }
        });
    }
    
    const query2 = `select max(A)`

    encodeURIComponent(query);

    log('query', encodeURIComponent(query));
    /*return fetch(
        `https://docs.google.com/spreadsheets/d/${spreadsheetUrl.split('/')[5]}/gviz/tq?tq=${encodeURIComponent(query2)}&tq=${encodeURIComponent(query)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((res) => {
          log('res', res);
          return res.text();
        })
        .then((resText) => {
            log('query', 'resText', resText);
          const json = JSON.parse(resText.substring(47, resText.length - 2));
          log('query', 'json', json);
          return json;
        });*/
        const url = `https://docs.google.com/spreadsheets/d/${spreadsheetUrl.split('/')[5]}/gviz/tq?tq=${encodeURIComponent(query2)}&tq=${encodeURIComponent(query)}`;
        getVisualizationData(url, authToken, query, query2, spreadsheetUrl)
        .then(data => {
          // data contains parsed JSON 
          log('query', 'data', data);
        });



}
//TODO: make this less ugly
async function getVisualizationData(url: string, authToken: string, query: string, query2: string, spreadsheetUrl: string) {

  const response = await fetch(
    `https://docs.google.com/spreadsheets/d/${spreadsheetUrl.split('/')[5]}/gviz/tq?tq=${encodeURIComponent(query2)}&tq=${encodeURIComponent(query)}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });
  const text = await response.text();

  log('getVisualizationData', 'text', text);

  const boundaryMatch = text.match(/boundary=(.*)/);
  const boundary = boundaryMatch ? boundaryMatch[1] : null;
  
  const parts = text.split(boundary || '');

  const dataPart = parts[2];
  const dataText = dataPart.split('\n\n')[1];

  return JSON.parse(dataText);

}
