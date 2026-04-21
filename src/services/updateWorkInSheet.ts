import { Work } from "@/models"
import { HttpMethod, makeRequest } from './httpRequest.ts';

export const updateWorkInSheet = async (spreadsheetId: string, accessToken: string, work: Work): Promise<boolean> => {
    logger.debug('updateWorkInSheet', work);

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
                        //TODO: this is the problem
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

    logger.debug('updateWorkInSheet response', response);

    return true;
}

export const addToHistory = async (work: Work, spreadsheetId: string, accessToken: string) => {
    logger.debug('addToHistory', work);
    logger.debug('entry',
        work.info?.history,
        work.info?.personalTags,
        work.info?.rating,
        work.info?.readCount)


    const range = `AccessWorks!$L$${work.info?.index}:$P$${work.info?.index}`;
    const response = await makeRequest({
        url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`,
        method: HttpMethod.PUT,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: {
            range: range,
            values: [
                [
                    work.info?.history ? JSON.stringify(work.info.history) : '',
                    work.info?.chapters ? JSON.stringify(work.info.chapters) : '',
                    work.info?.personalTags?.toString() ?? '',
                    work.info?.rating,
                    work.info?.readCount,
                ]
            ]
        }
    })

    logger.debug('addToHistory', response);
    const parsedResponse = await response.json();
    logger.debug('addToHistory', parsedResponse);
    if (response.status !== 200) {
        logger.error('Error adding to history: ', response);
        throw new Error('Error adding to history');
    }
    return response;
}