import { standardBlurbsPage } from '..';
import log from '../../utils/logger';
import { initializePort, MessageName, sendMessage } from "../../utils/chrome-services/messaging";

log('log: content_script.tsx loaded');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    log('content_script', 'heard message: ', message);
    if (message.message === 'userChanged') {
        log('userChanged');
        sendResponse({ response: 'userChanged heard' });
    }
});

initializePort()

sendMessage(
    MessageName.CheckLogin,
    {},
    (response) => {
        log('checkLogin response: ', response);
        if (response.status) {
            log('user is logged in');
            pageTypeDetect();
        } else {
            log('user is not logged in');
        }
    }
)

//TODO: check for work v. bookmark page first

function pageTypeDetect() {
    if(document.querySelector('.index.group.work')) {    //AFAIK, all blurbs pages have these classes
        //standard 20 work page
        standardBlurbsPage().then(() => {
            log('standardBlurbsPage done');
        });

    } else if (document.querySelector('.work.meta.group')){ //only found if inside a work
        log('Work Page');
    } else {
        log('PANIK: Unknown page');
    }
}
