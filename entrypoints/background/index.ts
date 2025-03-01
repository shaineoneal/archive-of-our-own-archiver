import {
    handleAddWorkToSpreadsheet,
    handleIsAccessTokenValid,
    handleQuerySpreadSheet,
    onMessage
} from "@/utils/browser-services";

export default defineBackground(() => {
    console.log('background script running');

    browser.storage.session.setAccessLevel({accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS'})
        .then(() => {
            console.log('access level set');
        });

    onMessage('QuerySpreadSheet', handleQuerySpreadSheet);
    onMessage('AddWorkToSpreadsheet', handleAddWorkToSpreadsheet);
    onMessage('IsAccessTokenValid', handleIsAccessTokenValid);
});
