import { log } from './utils/logger';
import { Work } from './works';

log('saveWork loaded');

/*export function saveWork(authToken: string, work: Work) {
    log('saveWork called');

    const params = {
        spreadsheetId
        Range
        valueInputOption
        insertDataOption
    }

    const valueRangeBody = {
        "majorDimension": "ROWS",
        "values": [
            //array from Work info
        ]
    }

    const request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
}
*/