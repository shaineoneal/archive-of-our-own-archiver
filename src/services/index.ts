import { sendMessage } from './messaging.ts';

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
export * from '../models/work.tsx'


export async function getAo3Urls () {
    return await browser.tabs.query({ url: '*://archiveofourown.org/*' });
}

export async function sendMessageToAo3Tabs (message: any) {
    const tabs = await getAo3Urls();
    for (const tab of tabs) {
        await sendMessage(message, tab.id);
    }
}