import { standardBlurbsPage } from './blurbsPage.tsx';
import { getAccessTokenCookie } from "@/utils/browser-services/cookies.ts";
import { onMessage, sendMessage } from "@/utils/browser-services/messaging.ts";
import { log } from '@/utils/logger.ts';
import { MessageResponse } from "@/utils/types/MessageResponse";
import { SyncUserStore } from "@/utils/zustand";

// Interface for message structure
interface Message {
    message: string;
}

// Listener for messages from the background script
export const messageListener = (message: Message, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void): void => {
    log('content_script', 'heard message: ', message);
    if (message.message === 'userChanged') {
        log('userChanged');
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
        log('tab is now visible');
        //initializePort();
        checkAccessToken();
    } else {
        log('tab is now hidden, closing port');
        //closePort();
        disconnectContentScript();
    }
}

// Check if the access token cookie is present
function checkAccessToken(): void {
    getAccessTokenCookie().then((accessToken: string | undefined) => {
        if (accessToken) {
            log('accessToken cookie found!: ', accessToken);
        } else {
            log('no accessToken cookie found');
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
    //            log('refreshAccessToken error: ', response.error);
    //        } else {
    //            log('refreshAccessToken response: ', response.response);
    //            pageTypeDetect();
    //        }
    //    }
    //);
}

// Detect the type of page and handle accordingly
function pageTypeDetect(): void {
    if (document.querySelector('.index.group.work')) {
        standardBlurbsPage().then(() => {
            log('standardBlurbsPage done');
        });
    } else if (document.querySelector('.work.meta.group')) {
        log('Work Page');
    } else {
        log('PANIK: Unknown page');
    }
}

// Disconnect the content script from the background script
function disconnectContentScript(): void {
    chrome.runtime.onMessage.removeListener(messageListener);
    //closePort();
}

// Main function to initialize the content script
export async function main() {
    log('log: content_script.tsx loaded');
    const resp = await sendMessage('checkLogin', undefined);
    if(resp) {
        log('user is logged in');
        pageTypeDetect();
    } else {
        log('user is not logged in');
    }
}

// Add event listeners
chrome.runtime.onMessage.addListener(messageListener);
//document.addEventListener('visibilitychange', handleVisibilityChange);
const { userStoreLogin } = SyncUserStore.getState().actions;
// sent from popup/login.tsx
onMessage('LoggedIn', (data) => {
    log('logged in message received', data);
    if (data.data.accessToken && data.data.refreshToken) {
        log('storing tokens');
        //userStoreLogin(data.data.accessToken, data.data.refreshToken);
    }
    //log('userStoreLogin done', SyncUserStore.getState().user);
    pageTypeDetect();
});
// Execute the main function
main();