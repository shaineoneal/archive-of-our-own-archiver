import {
    handleAddWorkToSpreadsheet,
    handleGetValidAccessToken,
    handleIsAccessTokenValid,
    handleLoggedIn,
    handleLogin,
    handleQuerySpreadSheet,
    handleUpdateWorkInSpreadsheet,
    onMessage
} from "@/services";

export default defineBackground(() => {
    logger.info('background script running');


    onMessage('QuerySpreadSheet', handleQuerySpreadSheet);
    onMessage('AddWorkToSpreadsheet', handleAddWorkToSpreadsheet);
    onMessage('IsAccessTokenValid', handleIsAccessTokenValid);
    onMessage('GetValidAccessToken', handleGetValidAccessToken);
    onMessage('Login', handleLogin);
    onMessage('LoggedIn', handleLoggedIn);
    onMessage('UpdateWorkInSpreadsheet', handleUpdateWorkInSpreadsheet);
});
