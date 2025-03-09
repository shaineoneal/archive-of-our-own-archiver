import {
    handleAddWorkToSpreadsheet, handleGetValidAccessToken,
    handleIsAccessTokenValid, handleLogin,
    handleQuerySpreadSheet,
    onMessage
} from "@/utils/browser-services";

export default defineBackground(() => {
    console.log('background script running');

    onMessage('QuerySpreadSheet', handleQuerySpreadSheet);
    onMessage('AddWorkToSpreadsheet', handleAddWorkToSpreadsheet);
    onMessage('IsAccessTokenValid', handleIsAccessTokenValid);
    onMessage('GetValidAccessToken', handleGetValidAccessToken);
    onMessage('Login', handleLogin);
});
