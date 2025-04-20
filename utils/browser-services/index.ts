import { sendMessage } from './messaging.ts';

export * from './accessToken.tsx';
export * from './addWorkToSheet.tsx';
export * from './cookies.ts';
export * from './httpRequest.ts';
export * from './messaging.ts';
export * from './oauthSignIn.ts';
export * from './querySpreadsheet.tsx';
export * from './refreshToken.ts';
export * from './removeWorkFromSheet.ts';
export * from './spreadsheet.tsx';
export * from './store.ts';

export async function getAo3Urls () {
    return await browser.tabs.query({ url: '*://archiveofourown.org/*' });
}

export async function sendMessageToTabs (type:any, message: any) {
    const tabs = await getAo3Urls();
    for (const tab of tabs) {
        await sendMessage(message, tab.id);
    }
}