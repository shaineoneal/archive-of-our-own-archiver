import {
    createSpreadsheet,
    handleAddWorkToSpreadsheet,
    handleGetValidAccessToken,
    handleIsAccessTokenValid,
    handleLogin,
    handleQuerySpreadSheet,
    handleUpdateWorkInSpreadsheet,
    onMessage,
    revokeTokens,
    sendMessage,
    sendMessageToTabs
} from "@/services";
import { exchangeCodeForToken } from "@/services/customAuthFlow.ts";
import { SyncUserStore } from "@/stores";

export default defineBackground(() => {
    logger.info('background script running');

    onMessage('QuerySpreadSheet', handleQuerySpreadSheet);
    onMessage('AddWorkToSpreadsheet', handleAddWorkToSpreadsheet);
    onMessage('IsAccessTokenValid', handleIsAccessTokenValid);
    onMessage('GetValidAccessToken', handleGetValidAccessToken);
    onMessage('Login', handleLogin);
    onMessage('UpdateWorkInSpreadsheet', handleUpdateWorkInSpreadsheet);

    browser.tabs.onUpdated.addListener(async (tabId: number, changeInfo: any, tabInfo: any) => {

        logger.debug('triggered: ', tabId, changeInfo, tabInfo);
        const {getUser, userStoreLogin} = SyncUserStore.getState().actions;
        const user = await getUser();

        logger.debug('triggered: ', user, changeInfo);

        if (changeInfo.url && changeInfo.url.startsWith(import.meta.env.CHROME ? import.meta.env.WXT_API_REDIRECT_URI : "https://shaine.io")) {
            const url = new URL(changeInfo.url);
            const code = url.searchParams.get("code");

            if (code) {
                // Retrieve the verifier we tucked away earlier
                const stored = await browser.storage.local.get("pending_verifier");
                const verifier = stored.pending_verifier;

                if (verifier) {
                    try {
                        const flowResp = await exchangeCodeForToken(code, verifier);

                        if (flowResp.access_token && flowResp.refresh_token) {
                            const access_token = flowResp.access_token;
                            const refresh_token = flowResp.refresh_token;
                            //TODO: if no refresh token, fix it

                            // If the response has a refresh token, store the async login
                            // then send a message to the content script to update the login status
                            if (refresh_token) {
                                if (!user.spreadsheetId || user.spreadsheetId === '') {
                                    // If the user has no spreadsheetId, create a new one
                                    const newSheet = await createSpreadsheet(access_token);
                                    userStoreLogin(access_token, refresh_token, newSheet);
                                    await sendMessage('LoggedIn', {
                                        accessToken: access_token,
                                        refreshToken: refresh_token,
                                        spreadsheetId: newSheet
                                    });
                                    await sendMessageToTabs('LoggedIn',
                                        {
                                            accessToken: access_token,
                                            refreshToken: refresh_token,
                                            spreadsheetId: newSheet
                                        });
                                } else {
                                    userStoreLogin(access_token, refresh_token, user.spreadsheetId);
                                    await sendMessage('LoggedIn', {
                                        accessToken: access_token,
                                        refreshToken: refresh_token,
                                        spreadsheetId: user.spreadsheetId
                                    });
                                    await sendMessageToTabs('LoggedIn',
                                        {
                                            accessToken: access_token,
                                            refreshToken: refresh_token,
                                            spreadsheetId: user.spreadsheetId
                                        });
                                }
                            } else {
                                logger.debug("No refresh token found, revoking tokens");
                                await revokeTokens(access_token);
                            }
                        }
                        // Store your new tokens and clean up

                        logger.info("Login successful!");
                        logger.debug('tokens', flowResp);
                    } catch (error) {
                        logger.error("Token exchange failed", error);
                    }
                }
            }

            // Always close the tab once the redirect is caught
            browser.tabs.remove(tabId);
        }
    });
});
