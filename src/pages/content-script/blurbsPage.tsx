import { wrap } from '../../utils';
import { MessageName, sendMessage } from '../../utils/chrome-services';
import log from '../../utils/logger';
import { WorkBlurb } from './WorkBlurb';
import { addBlurbToggle } from './blurbToggles';
import { looksRead } from './looksRead';


export const standardBlurbsPage = () => {

    const temp = document.querySelector('li.work, li.bookmark');

    log('temp style: ', getComputedStyle(temp!));
    log('temp style: ', JSON.stringify(getComputedStyle(temp!)));

    const worksOnPage = Array.from(
        document.querySelectorAll(
            'li.work, li.bookmark'
        ) as unknown as HTMLCollectionOf<HTMLElement>
    );

    let searchList: any[] = [];
    worksOnPage.forEach((work) => {
        let newEl = document.createElement('div');
        newEl.classList.add('blurb-with-toggles');


        newEl.style.cssText = JSON.stringify(getComputedStyle(work));

        wrap(work, newEl);

        addBlurbToggle(newEl);
        //if it's a bookmark, use the class to get the work id
        if (work.classList.contains('bookmark')) {
            searchList.push(work.classList[3].split('-')[1]);
        } else {
            //else it's a work, use the id to get the work id
            searchList.push(work.id.split('_')[1]);
        }
    });

    log('searchList: ', searchList);

    //only needs to be called when button is pressed
    log('work: ', WorkBlurb.getWorkFromPage(searchList[0]));
    //port.postMessage({ message: 'batchUpdate', work: (Work.getWorkFromPage(searchList[0])) });

    //TODO: sendMessage is completely broken and I don't know why
    //sendMessage(
    //    MessageName.QuerySpreadsheet,
    //    { list: searchList },
    //    (response: boolean[]) => injectWorkStatuses(worksOnPage, response)
    //)

    //TODO: this is a placeholder
    chrome.runtime.sendMessage({ message: 'querySpreadsheet', list: searchList }, (response) => {
        log('querySheet response: ', response);
        injectWorkStatuses(worksOnPage, response);
    });

}

/**
 * Inject the read status of a list of works into the page
 * @param { HTMLElement[] } worksOnPage - the works on the page
 * @param { boolean[] } response - the list of works from sheet
 */
function injectWorkStatuses(worksOnPage: HTMLElement[], response: any): void {
    log('injectWorkStatuses: ', response);
    response.response.forEach((workRef: boolean, index: number) => {
        log('workRef: ', workRef)
        if (workRef) {
            looksRead(true, worksOnPage[index]);
        }
    });
}

