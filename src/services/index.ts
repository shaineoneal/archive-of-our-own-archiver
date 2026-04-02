export * from './accessToken.ts';
export * from './addWorkToSheet.ts';
export * from './cookies.ts';
export * from './httpRequest.ts';
export * from './messaging.ts';
export * from './oauthSignIn.ts';
export * from './querySpreadsheet.ts';
export * from './refreshToken.ts';
export * from './removeWorkFromSheet.ts';
export * from './spreadsheet.ts';
export * from './store.ts';
export * from '../models/ao3BaseWork.ts'
export * from '../models/work.tsx'


export async function getAo3Urls () {
    return await browser.tabs.query({ url: '*://archiveofourown.org/*' });
}

export async function sendMessageToAo3Tabs (message: any) {
    logger.debug('Sending message to Ao3Tabs');
    const tabs = await getAo3Urls();
    for (const tab of tabs) {
        logger.debug('Sending message to Ao3Tab: ', tab.id);
        await browser.tabs.sendMessage(tab.id!, message);

    }
}