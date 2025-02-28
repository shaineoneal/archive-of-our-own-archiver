import { standardBlurbsPage } from './blurbsPage.tsx';
import { getAccessTokenCookie } from "@/utils/browser-services/cookies.ts";
import { onMessage, sendMessage } from "@/utils/browser-services/messaging.ts";
import { MessageResponse } from "@/utils/types/MessageResponse";
import { SyncUserStore } from "@/utils/zustand";

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
export function handleVisibilityChange(): void {
    if (document.visibilityState === 'visible') {
        console.log('tab is now visible');
        //initializePort();
        checkAccessToken();
    } else {
        console.log('tab is now hidden, closing port');
        //closePort();
        disconnectContentScript();
    }
}

// Check if the access token cookie is present
function checkAccessToken(): void {
    getAccessTokenCookie().then((accessToken: string | undefined) => {
        if (accessToken) {
            console.log('accessToken cookie found!: ', accessToken);
        } else {
            console.log('no accessToken cookie found');
            refreshAccessToken();
        }
    });
}

// Request to refresh the access token
function refreshAccessToken(): void {
    //sendMessage(
    //    MessageName.RefreshAccessToken,
    //    {},
    //    (response: MessageResponse<string>) => {
    //        if (response.error) {
    //            console.log('refreshAccessToken error: ', response.error);
    //        } else {
    //            console.log('refreshAccessToken response: ', response.response);
    //            pageTypeDetect();
    //        }
    //    }
    //);
}

// Detect the type of page and handle accordingly
function pageTypeDetect(): void {
    if (document.querySelector('.index.group.work')) {
        standardBlurbsPage().then(() => {
            console.log('standardBlurbsPage done');
        });
    } else if (document.querySelector('.work.meta.group')) {
        console.log('Work Page');
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
    console.log('log: content_script.tsx loaded');
    const resp = await sendMessage('checkLogin', undefined);
    if(resp) {
        console.log('user is logged in');
        pageTypeDetect();
    } else {
        console.log('user is not logged in');
    }
}

// Add event listeners
chrome.runtime.onMessage.addListener(messageListener);
//document.addEventListener('visibilitychange', handleVisibilityChange);
const { userStoreLogin } = SyncUserStore.getState().actions;
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