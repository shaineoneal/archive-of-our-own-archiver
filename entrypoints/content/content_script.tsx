import { standardBlurbsPage } from './blurbsPage.tsx';
import { getAccessTokenCookie } from "@/utils/browser-services/cookies.ts";
import { onMessage, sendMessage } from "@/utils/browser-services/messaging.ts";
import { MessageResponse } from "@/utils/types/MessageResponse";
import { SessionUserStore, SyncUserStore, useUser } from "@/utils/zustand";
import { insideWorkPage } from "@/entrypoints/content/insideWorkPage.tsx";

// Interface for message structure
interface Message {
    message: string;
}

// Listener for messages from the background script
export const messageListener = (message: Message, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void): void => {
    console.log('content_script', 'heard message: ', message);
    if (message.message === 'userChanged') {
        console.log('userChanged');
        handleUserChanged(sendResponse);
    }
};

// Handle user change event
function handleUserChanged(sendResponse: (response: any) => void): void {
    disconnectContentScript();
    sendResponse({ response: 'userChanged heard' });
}

// Handle visibility change of the tab
export async function handleVisibilityChange(): Promise<void> {
    if (document.visibilityState === 'visible') {
        console.log('tab is now visible');
        const resp = await sendMessage('GetValidAccessToken', undefined)
        // see if page already loaded
        pageTypeDetect();
    } else {
        console.log('tab is now hidden, closing port');
        //closePort();
        disconnectContentScript();
    }
}

// Detect the type of page and handle accordingly
function pageTypeDetect(): void {
    if (document.querySelector('.index.group.work')) {
        standardBlurbsPage().then(() => {
            console.log('standardBlurbsPage done');
        });
    } else if (document.querySelector('.work.meta.group')) {
        console.log('Work Page');
        insideWorkPage().then(() => {
            console.log('insideWorkPage done');
        });
    } else {
        console.log('PANIK: Unknown page');
    }
}

// Disconnect the content script from the background script
function disconnectContentScript(): void {
    chrome.runtime.onMessage.removeListener(messageListener);
    //closePort();
}

// Main function to initialize the content script
export async function main() {
    const user = await SyncUserStore.getState().actions.getUser()
    console.log('log: content_script.tsx loaded', user);
    try {
        const resp = await sendMessage('GetValidAccessToken', undefined);

        if(resp) {
            console.log('user is logged in');
            pageTypeDetect();
        }
    } catch (e) {
        console.log('error getting valid access token', e);
        //TODO: handle error
        // maybe re-call webAuthFlow non-interactively
    }
    /*if(user.accessToken) {
        const resp = await sendMessage('IsAccessTokenValid', user.accessToken!);
        log('IsAccessTokenValid response', resp);
        if (resp) {
            console.log('user is logged in');
            SyncUserStore.getState().actions.userStoreLogin(user.accessToken, user.refreshToken!, user.spreadsheetId!);
            pageTypeDetect();
        } else {
            console.log('user is not logged in, access token is invalid');
        }
    } else {
        console.log('user is not logged in');
    }*/
}

// Add event listeners
//browser.runtime.onMessage.addListener(messageListener);
//document.addEventListener('visibilitychange', handleVisibilityChange);

// sent from popup/login.tsx
onMessage('LoggedIn', (data) => {
    console.log('logged in message received', data);
    if (data.data.accessToken && data.data.refreshToken) {
        console.log('storing tokens');
        //userStoreLogin(data.data.accessToken, data.data.refreshToken);
    }
    //console.log('userStoreLogin done', SyncUserStore.getState().user);
    pageTypeDetect();
});
// Execute the main function
main();

//listener for updates to the user store
browser.storage.local.onChanged.addListener(main)