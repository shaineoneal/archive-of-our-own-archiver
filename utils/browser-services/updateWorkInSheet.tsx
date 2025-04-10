import { Work } from "@/entrypoints/content";
import { HttpMethod, makeRequest } from './httpRequest.ts';

export const updateWorkInSheet = async (spreadsheetId: string, accessToken: string, work: Work): Promise<boolean> => {
    console.log('updateWorkInSheet', work);

    const response = await makeRequest({
        url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
        method: HttpMethod.POST,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: {
            valueInputOption: 'USER_ENTERED',
            data: [ {
                range: `AccessWorks!K${work.info?.index}`,
                majorDimension: 'ROWS',
                values: [
                    [
                        'read', // TODO: change this to a variable
                        JSON.stringify(work.info?.history),
                        work.info?.personalTags?.toString() ?? '',
                        work.info?.rating,
                        work.info?.readCount,
                        work.info?.skipReason?.toString() ?? ''
                    ]
                ]
            }]
        }
    });

    console.log('updateWorkInSheet response', response);

    return true;
}