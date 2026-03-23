import {
    handleAddWorkToSpreadsheet,
    handleGetValidAccessToken,
    handleIsAccessTokenValid,
    handleLogin,
    handleQuerySpreadSheet,
    handleUpdateWorkInSpreadsheet,
    onMessage
} from "@/utils/browser-services";

export default defineBackground(() => {
    logger.info('background script running');

    onMessage('QuerySpreadSheet', handleQuerySpreadSheet);
    onMessage('AddWorkToSpreadsheet', handleAddWorkToSpreadsheet);
    onMessage('IsAccessTokenValid', handleIsAccessTokenValid);
    onMessage('GetValidAccessToken', handleGetValidAccessToken);
    onMessage('Login', handleLogin);
    onMessage('UpdateWorkInSpreadsheet', handleUpdateWorkInSpreadsheet);
});
