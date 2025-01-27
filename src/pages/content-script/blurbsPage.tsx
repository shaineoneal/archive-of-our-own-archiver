import { initializePort, MessageName, sendMessage } from "../../utils/chrome-services/messaging";
import { log } from '../../utils/logger';
import { MessageResponse } from "../../utils/types/MessageResponse";
import { addBlurbControls } from './blurbControls';
import { changeBlurbStyle } from './changeBlurbStyle';

export async function standardBlurbsPage() {
    // check if page already has work statuses
    const workStatuses = document.querySelectorAll('.blurb-with-toggles') as NodeList;
    if (workStatuses.length > 0) {
        log('Work statuses already injected.')
        return;
    }

    const worksOnPage = document.querySelectorAll('li.work, li.bookmark') as NodeList

    let searchList: number[] = [];
    worksOnPage.forEach((work) => {
        const workEl = work as Element;
        if (workEl.classList.contains('bookmark')) {
            searchList.push(Number(workEl.classList[3].split('-')[1]));
        } else {
            searchList.push(Number(workEl.id.split('_')[1]));
        }
    });

    log('searchList: ', searchList);

    initializePort();

    sendMessage(
        MessageName.QuerySpreadsheet,
        { list: searchList },
        async (response: MessageResponse<boolean[]>) => {
            log('QuerySpreadsheet response: ', response)
            if (response === null) {
                log('No work statuses to inject.')
                addBlurbControls(worksOnPage, []);
                return;
            }
            if (response.error) {
                log('Error querying spreadsheet: ', response.error);
                return;
            }
            await injectWorkStatuses(worksOnPage, response.response);
            log('Injected work statuses.');
            addBlurbControls(worksOnPage, response.response);
        }
    )
}

/**
 * Inject the read status of a list of works into the page
 * @param { HTMLElement[] } worksOnPage - the works on the page
 * @param { boolean[] } response - the list of works from sheet
 */
async function injectWorkStatuses(worksOnPage: NodeList, response: boolean[]) {
    if(response === null) {
        return Error;
    } else {
        response.forEach((workRef: boolean, index: number) => {
            log('workRef: ', workRef)
            if (workRef) {
                const workId = (worksOnPage[index] as Element).id.split('_')[1]
                chrome.storage.session.get(workId, (result) => {
                    log('session result: ', result);
                    if (result[workId].status === 'read') {
                        changeBlurbStyle('read', (worksOnPage[index].parentNode!));
                    }
                });
            }
        });
    }
    log('updated works: ', worksOnPage);
}