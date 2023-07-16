import { blurbToggle } from './components/blurbToggles';
import { log } from './utils/logger';
import { wrap } from './utils/wrapper';
import { Work } from './works';

log('log: content_script.tsx loaded');

//open up connection to background script

const port = chrome.runtime.connect({ name: 'content_script' });

const temp = document.querySelector('li.work, li.bookmark');
log('temp: ', temp);
log('temp style: ', getComputedStyle(temp!));
log('temp style: ', JSON.stringify(getComputedStyle(temp!)));

const works = Array.from(
    document.querySelectorAll(
        'li.work, li.bookmark'
    ) as unknown as HTMLCollectionOf<HTMLElement>
);

var searchList = new Array();
works.forEach((work) => {
    var newEl = document.createElement('div');
    newEl.classList.add('blurb-with-toggles');


    newEl.style.cssText = JSON.stringify(getComputedStyle(work));

    wrap(work, newEl);

    blurbToggle(newEl, port);
    //if its a bookmark, use the class to get the work id
    if (work.classList.contains('bookmark')) {
        searchList.push(work.classList[3].split('-')[1]);
    } else {
        //else its a work, use the id to get the work id
        searchList.push(work.id.split('_')[1]);
    }
});

log('searchList: ', searchList);

//only needs to be called when button is pressed
log('work: ', Work.getWorkFromPage(searchList[0]));
port.postMessage({ message: 'batchUpdate', work: (Work.getWorkFromPage(searchList[0])) });

port.postMessage({ message: 'querySheet', list: searchList });

port.onMessage.addListener((msg) => {
    log('content_script', 'port.onMessage: ', msg);
});