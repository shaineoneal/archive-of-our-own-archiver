import { standardBlurbsPage } from './pages';
import { log } from './utils';

log('log: content_script.tsx loaded');

//open up connection to background script
const port = chrome.runtime.connect({ name: 'content_script' });

//TODO: check for work v. bookmark page first


if(document.querySelector('.index.group.work')) {    //AFIK, all blurbs pages have these classes
    //standard 20 work page
    standardBlurbsPage(port);

} else if (document.querySelector('.work.meta.group')){ //only found if inside a work
    log('Work Page');
} else {
    log('PANIK: Unknown page');
}