import { addToggleToBox } from '../toggles/baseToggleBox';
import { BlurbToggles } from '../toggles/blurbToggles';
import { looksSeen } from '../toggles/looksSeen';
import { TOGGLE, createToggle, toggleTypes } from '../toggles/toggleTypes';
import { log, wrap } from '../utils';


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
        var newEl = document.createElement('li');
        newEl.classList.add('blurb-with-toggles');
        newEl.classList.add('blurb');

        //newEl.style.cssText = document.defaultView!.getComputedStyle(work).cssText;

        wrap(work, newEl);

        //TODO: change per work type
        
        log('toggleTypes: ', toggleTypes);

        addToggleToBox(BlurbToggles.addToggleBox(newEl), [createToggle(toggleTypes[0], work), createToggle(toggleTypes[1], work), createToggle(toggleTypes[2], work)]);
        

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
    //log('work: ', WorkBlurb.getWorkFromWorksPage(searchList[0]));
    //port.postMessage({ message: 'batchUpdate', work: (Work.getWorkFromPage(searchList[0])) });

    port.postMessage({ message: 'querySheet', list: searchList });

    port.onMessage.addListener((msg) => {
        log('content_script', 'port.onMessage: ', msg);

        if (msg.reason === 'querySheet') {
            if (msg.response) {
                msg.response.forEach((workRef: boolean, index: number) => {
                    log('workRef: ', workRef)
                    if (workRef) {
                        looksSeen(true, works[index]);
                    }
                });
            }
            
        }
    });
}
