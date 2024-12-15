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

/*
 * @startuml
 * participant content_script [[content_script.tsx]]
 * participant background [[../background/background.ts]]
 * participant "session storage" as session
 *
 * content_script -> background : connectPort
 * activate background
 * background --> content_script : port
 * deactivate background
 *
 * activate content_script
 * content_script -> background : checkLogin
 * activate background
 * background -> background : check login
 * activate background #green
 * background -> session : set user
 * activate session
 * session --> background : user set
 * deactivate session
 * background --> content_script : loggedIn
 * @enduml
 */
initializePort()
//    .then((port) => {
//    log('connected to port');
//
//    //port.postMessage({ message: 'checkLogin' });
//    sendMessage(port, MessageName.CheckLogin, {})
//
//    //receiveMessage(port, 'querySpreadsheet', async (payload) => {
//    //    log('querySpreadsheet payload: ', payload);
//    //    return true;
//    //});
//    port.onMessage.addListener((msg) => {
//        log('content_script', 'port.onMessage: ', msg);
//        if (msg.payload === true) {
//            log('user is logged in');
//            pageTypeDetect(port);
//        }
//        else if (!msg.loggedIn) {
//            log('user is not logged in');
//        }
//    });
//});

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

//open up connection to background script
async function connectPort(): Promise<chrome.runtime.Port> {
    const port = chrome.runtime.connect({ name: 'content_script' });
    log('port: ', port);
    return port;
}

//TODO: check for work v. bookmark page first

function pageTypeDetect() {
    if(document.querySelector('.index.group.work')) {    //AFAIK, all blurbs pages have these classes
        //standard 20 work page
        standardBlurbsPage();

    } else if (document.querySelector('.work.meta.group')){ //only found if inside a work
        log('Work Page');
    } else {
        log('PANIK: Unknown page');
    }
}
