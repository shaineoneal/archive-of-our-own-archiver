import { log } from '../../utils/logger';
import { Work } from '../../works';
import { fetchSpreadsheetUrl, fetchToken } from '..';
import { post } from 'jquery';

export async function addWorkToSheet(work: Work) {

    const port = chrome.runtime.connect({ name: 'content_script' });

    log('addWorkToSheet', work);
    let spreadsheetUrl = '';
    let authToken = '';


    port.postMessage({ message: 'batchUpdate', work: work });
    //port.postMessage({ message: 'fetchSheetUrl' });

    port.onMessage.addListener((msg) => {
        log('msg: ', msg);
        if (msg.token) {
            log('got token: ', msg.token);
            return authToken = msg.token;
        } else if (msg.spreadsheetUrl) {
            log('got spreadsheetUrl: ', msg.spreadsheetUrl);
            spreadsheetUrl = msg.sheetUrl;

            if (spreadsheetUrl && authToken) {
                port.postMessage({ message: 'batchUpdate', work: work, spreadsheetUrl: spreadsheetUrl, authToken: authToken });
            }
        
            log ('authToken check: ', authToken);
        
            port.onMessage.addListener((msg) => {
                log('new msg: ', msg);
            });
        
        }
    });
}

    
