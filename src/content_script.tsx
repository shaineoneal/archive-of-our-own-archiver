import { addWorkToSheet } from './chrome-services/utils/appendToSheet';
import { blurbToggles } from './components/blurbToggles';
import { log } from './utils/logger';
import { wrap } from './utils/wrapper';
import { Work } from './works';

log('log: content_script.tsx loaded');

//open up connection to background script






const works = Array.from(
    document.querySelectorAll(
        'li.work, li.bookmark'
    ) as unknown as HTMLCollectionOf<HTMLElement>
);

var searchList = new Array();
works.forEach((work) => {
    var newEl = document.createElement('div');
    newEl.classList.add('blurb-with-toggles');

    wrap(work, newEl);

    blurbToggles(work);
    //if its a bookmark, use the class to get the work id
    if (work.classList.contains('bookmark')) {
        searchList.push(work.classList[3].split('-')[1]);
    } else {
        //else its a work, use the id to get the work id
        searchList.push(work.id.split('_')[1]);
    }
});

log('searchList: ', searchList);

const workId = searchList[1];

log('work: ', Work.getWorkFromPage(workId));
//port.postMessage({ message: 'getAuthToken' });

//port.onMessage.addListener((msg) => {
//    log('msg: ', msg.token);
//    if (msg.token !== '') {
        addWorkToSheet(Work.getWorkFromPage(workId))?.then((response) => {
            log('response: ', response);
        }); 


//addWorkToSheet(Work.getWorkFromPage(workId))?.then((response) => {
//    log('response: ', response);
//});
