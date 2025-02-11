import { User_BaseWork } from "../../entrypoints/content/User_BaseWork.tsx";
import { log } from '@/utils/logger.ts';
import { HttpMethod, makeRequest } from './httpRequest.ts';

export const updateWorkInSheet = async (spreadsheetId: string, accessToken: string, work: User_BaseWork): Promise<boolean> => {
    log('updateWorkInSheet', work);

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
                range: `AccessWorks!K${work.index}`,
                majorDimension: 'ROWS',
                values: [
                    [
                        'read', // TODO: change this to a variable
                        JSON.stringify(work.history),
                        work.personalTags?.toString() ?? '',
                        work.rating,
                        work.readCount,
                        work.skipReason?.toString() ?? ''
                    ]
                ]
            }]
        }
    });

    log('updateWorkInSheet response', response);

    return true;
}