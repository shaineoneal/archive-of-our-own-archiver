import { standardBlurbsPage } from './pages';
import log from './utils/logger';

log('log: content_script.tsx loaded');
connectPort().then((port) => {
    getToken(port).then((token) => {
        log('token: ', token);
        pageTypeDetect(port);
    });
}
);
//open up connection to background script
async function connectPort(): Promise<chrome.runtime.Port> {
    const port = await chrome.runtime.connect({ name: 'content_script' });
    log('port: ', port);
    return port;
}

//confirm port connection and get auth token
async function getToken(port: chrome.runtime.Port) {
    const token = new Promise<string>((resolve) => {
        port.postMessage({ message: 'getAuthToken' });
        port.onMessage.addListener((msg) => {
            log('content_script', 'port.onMessage: ', msg);
            if (msg.token) {
                log('resolved token: ', msg.token);
                resolve(msg.token);
            }
            if(msg.error) {     //user is not logged in
                log('error: ', msg.error);
                resolve('');
            }
        });
        //reject('Error getting token');
    });

    log('token check: ', token);
    token.then((token) => {
        log('token: ', token);
        return token;
    }).catch((err) => {
        log('error: ', err);
        return '';
    });
}


//TODO: check for work v. bookmark page first

async function pageTypeDetect(port: chrome.runtime.Port) {
    if(document.querySelector('.index.group.work')) {    //AFIK, all blurbs pages have these classes
        //standard 20 work page
        standardBlurbsPage(port);

    } else if (document.querySelector('.work.meta.group')){ //only found if inside a work
        log('Work Page');
    } else {
        log('PANIK: Unknown page');
    }
}