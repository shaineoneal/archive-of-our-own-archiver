import log from '../../utils/logger';

// Get the sheetId from the spreadsheetUrl
// TODO: save the sheetId in session storage
export const getSheetId = async (spreadsheetUrl: string, authToken: string) => {
    log('getSheetId: ', spreadsheetUrl);
    
    return fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetUrl.split('/')[5]}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
            },
        }
    ).then((res) => res.json()
    ).then((res) => res.sheets[0].properties.sheetId);
}