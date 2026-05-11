import { insideWorkPage } from "@/entrypoints/content/other/insideWorksPage.tsx";
import { getValidAccessToken } from '@/services';
import { getAndSetTokens, revokeTokens, setTokens, useShelfHydration, useTokens } from '@/stores';
import { ReactElement } from 'react';
import { BlurbPortals } from "@/components/";

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
        // initializePort();
        // const resp = await sendMessage('GetValidAccessToken', undefined)
        // console.log(resp);
    } else {
        logger.debug('tab is now hidden, closing port');
        // closePort();
        disconnectContentScript();
    }
}

// Detect the type of page and handle accordingly
export function pageTypeDetect(): void {
    if (document.querySelector('.index.group.work')) {
        standardBlurbsPage().then(() => {
            logger.debug('standardBlurbsPage done');
        });
    } else if (document.querySelector('.work.meta.group')) {
        logger.debug('Work Page');
        insideWorkPage().then(() => {
            logger.debug('insideWorkPage done');
        });
    } else {
        logger.debug('PANIK: Unknown page');
    }
}

// Disconnect the content script from the background script
function disconnectContentScript(): void {
    chrome.runtime.onMessage.removeListener(messageListener);
    // closePort();
}

// Main function to initialize the content script
export async function main(ctx: any) {
    const { accessToken, refreshToken } = await getAndSetTokens();

    if (!accessToken || !refreshToken) {
        logger.debug('No access or refresh token found, user is not logged in');
        return;
    }

    try {
        const newAT = await getValidAccessToken(accessToken, refreshToken);
        if (newAT !== accessToken) {
            logger.debug('access token was refreshed, updating storage and reloading page');
            await setTokens({ accessToken: newAT, refreshToken });
        }
        pageTypeDetect();
    } catch (err) {
        logger.error('Unable to get valid access token, user is not logged in. Error: ', err);
        await revokeTokens();
    }
}

// Listener for updates to the user store
export function registerStorageListener() {
    browser.storage.local.onChanged.addListener((changes: Record<string, { newValue?: unknown }>) => {
        if (changes['user-store']) {
            logger.debug('user-store changed in storage, reloading content script...');
            main({});
        }
    });
}

export function unregisterStorageListener() {
    browser.storage.local.onChanged.removeListener(main);
}


export function App(): ReactElement {
    const { isHydrated, shelfVersion } = useShelfHydration();
    const { accessToken } = useTokens();

    return (
        <>
            <a href="chrome-extension://fpolkflkolbgaceliloehfofnoiklngb/popup.html" target="_blank">
                <span>++</span>
                <sup> also beta</sup>
            </a>
            {isHydrated && accessToken ? <BlurbPortals key={shelfVersion} /> : null}
        </>
    );
}