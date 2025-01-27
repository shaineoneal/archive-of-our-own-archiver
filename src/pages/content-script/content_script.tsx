import { standardBlurbsPage } from '..';
import { getAccessTokenCookie } from "../../utils/chrome-services/cookies";
import { closePort, initializePort, MessageName, sendMessage } from "../../utils/chrome-services/messaging";
import { log } from '../../utils/logger';
import { MessageResponse } from "../../utils/types/MessageResponse";

log('log: content_script.tsx loaded');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    log('content_script', 'heard message: ', message);
    if (message.message === 'userChanged') {
        log('userChanged');
        pageTypeDetect();
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

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        log('tab is now visible');

        getAccessTokenCookie().then((accessToken) => {
            if (accessToken) log('accessToken found!: ', accessToken);
            else {
                log('no accessToken found');
                chrome.runtime.sendMessage({ message: 'refreshAccessToken' });
                //initializePort();
                //sendMessage(
                //    MessageName.RefreshAccessToken,
                //    {},
                //    (response) => {
                //        log('refreshAccessToken response: ', response);
                //        if (response) {
                //            log('refreshAccessToken response: ', response);
                //            pageTypeDetect();
                //        }
                //    }
                //)
            }
        });

    } else {
        log('tab is now hidden, closing port');
        closePort();
    }
});