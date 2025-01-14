import { wrap } from '../../utils';
import log from '../../utils/logger';
import { Ao3_BaseWork } from './Ao3_BaseWork';
import { addBlurbControls } from './blurbControls';
import { changeBlurbStyle } from './changeBlurbStyle';
import { BaseWork } from "./BaseWork";
import { MessageName, sendMessage } from "../../utils/chrome-services/messaging";


export async function standardBlurbsPage() {

    const worksOnPage = Array.from(
        document.querySelectorAll(
            'li.work, li.bookmark'
        ) as unknown as HTMLCollectionOf<HTMLElement>
    );

    let searchList: number[] = [];
    worksOnPage.forEach((work) => {
        let newEl = document.createElement('div');
        newEl.classList.add('blurb-with-toggles');

        newEl.style.cssText = JSON.stringify(getComputedStyle(work));

        wrap(work, newEl);

        //if it's a bookmark, use the class to get the work id
        if (work.classList.contains('bookmark')) {
            searchList.push(Number(work.classList[3].split('-')[1]));
        } else {
            //else it's a work, use the id to get the work id
            searchList.push(Number(work.id.split('_')[1]));
        }
    });

    log('searchList: ', searchList);

    sendMessage(
        MessageName.QuerySpreadsheet,
        { list: searchList },
        (response) => {
            log('QuerySpreadsheet response: ', response)
            if (response === null) {
                log('No work statuses to inject.')
                return;
            }
            // @ts-ignore
            if (response.error) {
                // @ts-ignore
                log('Error querying spreadsheet: ', response.error);
                return;
            }
            injectWorkStatuses(worksOnPage, response).then(() => {
                log('Injected work statuses.');
                addBlurbControls(worksOnPage);
            });
        }
    )

}

/**
 * Inject the read status of a list of works into the page
 * @param { HTMLElement[] } worksOnPage - the works on the page
 * @param { boolean[] } response - the list of works from sheet
 */
async function injectWorkStatuses(worksOnPage: HTMLElement[], response: boolean[]) {

    if(response === null) {
        return Error;
    } else {
        response.forEach((workRef: boolean, index: number) => {
            log('workRef: ', workRef)
            if (workRef) {
                const workId = worksOnPage[index].id.split('_')[1]
                chrome.storage.session.get(workId, (result) => {
                    log('session result: ', result);
                    if (result[workId].status === 'read') {
                        changeBlurbStyle('read', worksOnPage[index]);

                    }
                });

            }
        });
    }
}