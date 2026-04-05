import { sendMessage } from "@/services/messaging.ts";
import { UserStore } from "@/stores/userStore";
import { ReactElement } from 'react';
import { getValidAccessToken } from "@/services";


// Interface for message structure
interface Message {
    message: string;
}

// Listener for messages from the background script
export const messageListener = (message: Message, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void): void => {

    logger.debug('content_script', 'heard message: ', message);

    if (message.message === 'userChanged') {
        logger.info('userChanged');
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
        logger.debug('tab is now visible');
        //initializePort();
        //const resp = await sendMessage('GetValidAccessToken', undefined)
        //console.log(resp);
    } else {
        logger.debug('tab is now hidden, closing port');
        //closePort();
        disconnectContentScript();
    }
}

// Check if the access token cookie is present
function checkAccessToken(): void {

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
export function pageTypeDetect(): void {
    if (document.querySelector('.index.group.work')) {
        standardBlurbsPage().then(() => {
            logger.debug('standardBlurbsPage done');
        });
    } else if (document.querySelector('.work.meta.group')) {
        logger.debug('Work Page');
    } else {
        logger.debug('PANIK: Unknown page');
    }
}

// Disconnect the content script from the background script
function disconnectContentScript(): void {
    chrome.runtime.onMessage.removeListener(messageListener);
    //closePort();
}

// Main function to initialize the content script
export async function main(ctx: any) {
    const user = await UserStore.getState().actions.getUser();

    if(user.accessToken) {
        const resp = await sendMessage('IsAccessTokenValid', user.accessToken!);
        logger.debug('IsAccessTokenValid response', resp);
        if (resp) {
            logger.debug('user is logged in');
            SyncUserStore.getState().actions.userStoreLogin(user.accessToken, user.refreshToken!, user.spreadsheetId!);
            pageTypeDetect();
        } else {
            logger.debug('user is not logged in, access token is invalid');
            try {
                const newAT = await getValidAccessToken(user.accessToken, user.refreshToken!);
                SyncUserStore.getState().actions.userStoreLogin(newAT, user.refreshToken!, user.spreadsheetId!);
                pageTypeDetect();
            } catch (err) {
                logger.error(err);
            }
        }
    } else {
        logger.debug('user is not logged in');
    }
}

// Listener for updates to the user store
export function registerStorageListener() {
    browser.storage.local.onChanged.addListener(main);
}

export function unregisterStorageListener() {
    browser.storage.local.onChanged.removeListener(main);
}


export function App() : ReactElement {
    return (
        <a href="chrome-extension://fpolkflkolbgaceliloehfofnoiklngb/popup.html" target="_blank">
            <span>++</span>
            <sup> also beta</sup>
        </a>
    );
}