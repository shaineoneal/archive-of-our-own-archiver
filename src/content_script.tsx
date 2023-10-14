import { removeMutedWarning } from './content-scripts/removeMutedUserWarning';
import { standardBlurbsPage } from './pages';
import { log } from './utils';
import React from 'react';
import { createRoot } from 'react-dom/client';


console.log('log: content_script.tsx loaded');


const body = document.querySelector('body');

const app = document.createElement('link');


//log('log: content_script.tsx loaded');
app.id = 'root';
app.setAttribute('rel', 'stylesheet');
app.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');

if (body) {
    body.prepend(app);
}

removeMutedWarning();


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
    
    if(document.querySelector('.group.work')) {    //AFIK, all blurbs pages have these classes
        //standard 20 work page
        standardBlurbsPage(port);    

    } else if (document.querySelector('.work.meta.group')){ //only found if inside a work
        log('Work Page');
    } else {
        log('PANIK: Unknown page');
    }
}


//const star = document.createElement('i');
//star.className = 'fa fa-regular fa-star';
//toggle.append(star);