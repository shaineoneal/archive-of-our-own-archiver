import {
    handleAddWorkToSpreadsheet,
    handleCheckLogin,
    handleQuerySpreadSheet,
    onMessage
} from "@/utils/browser-services";

export default defineBackground(() => {
    log('background script running');

    browser.storage.session.setAccessLevel({accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS'})
        .then(() => {
            log('access level set');
        });

    onMessage('CheckLogin', handleCheckLogin);
    onMessage('QuerySpreadSheet', handleQuerySpreadSheet);
    onMessage('AddWorkToSpreadsheet', handleAddWorkToSpreadsheet);
});
