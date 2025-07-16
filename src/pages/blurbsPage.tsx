import { addBlurbToggle } from '../components/blurbToggles';
import { looksRead } from '../components/looksRead';
import { wrap } from '../utils';
import log from '../utils/logger';
import { WorkBlurb } from '../works/WorkBlurb';


export const standardBlurbsPage = (port: chrome.runtime.Port) => {


    const temp = document.querySelector('li.work, li.bookmark');
    log('port test: ', port);
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

        addBlurbToggle(newEl);
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
    log('work: ', WorkBlurb.getWorkFromPage(searchList[0]));
    //port.postMessage({ message: 'batchUpdate', work: (Work.getWorkFromPage(searchList[0])) });

    port.postMessage({ message: 'querySheet', list: searchList });

    port.onMessage.addListener((msg) => {
        log('content_script', 'port.onMessage: ', msg);

        if (msg.reason === 'querySheet') {
            if (msg.response) {
                msg.response.forEach((workRef: boolean, index: number) => {
                    log('workRef: ', workRef)
                    if (workRef) {
                        looksRead(true, works[index]);
                    }
                });
            }
            
        }
    });
}
