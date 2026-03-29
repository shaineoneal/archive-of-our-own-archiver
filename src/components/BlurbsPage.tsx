import { sendMessage } from "@/services/messaging.ts";
import { addBlurbControls } from './BlurbControls.tsx';
import { changeBlurbStyle } from '../utils/changeBlurbStyle.ts';
import { WorkStatus } from "@/types/data.ts";

export async function standardBlurbsPage() {
    // check if page already has work statuses
    const workStatuses = document.querySelectorAll('.blurb-with-toggles') as NodeList;
    if (workStatuses.length > 0) {
        logger.debug('Work statuses already injected.')
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

    logger.debug('searchList: ', searchList);



    const resp = await sendMessage('QuerySpreadSheet', searchList);
    logger.debug('QuerySpreadSheet response: ', resp);
    if (resp.length == 0) {
        logger.debug('No work statuses to inject.')
        addBlurbControls(worksOnPage, []);
        return;
    }
    //if (resp.error) {
    //    logger.debug('Error querying spreadsheet: ', resp.error);
    //    return;
    //}
    else {
        addBlurbControls(worksOnPage, resp);
        await injectWorkStatuses(worksOnPage, resp);
        logger.debug('Injected work statuses.');
    }
    //sendMessage(
    //    MessageName.QuerySpreadsheet,
    //    { list: searchList },
    //    async (response: MessageResponse<boolean[]>) => {
    //        logger.debug('QuerySpreadsheet response: ', response)
    //        if (response === null) {
    //            logger.debug('No work statuses to inject.')
    //            addBlurbControls(worksOnPage, []);
    //            return;
    //        }
    //        if (response.error) {
    //            logger.debug('Error querying spreadsheet: ', response.error);
    //            return;
    //        }
    //        await injectWorkStatuses(worksOnPage, response.response);
    //        logger.debug('Injected work statuses.');
    //        addBlurbControls(worksOnPage, response.response);
    //    }
    //)
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
        for (let i = 0; i < response.length; i++) {
            logger.debug('index: ', i);
            if (response[i]) {
                const workId = (worksOnPage[i] as Element).id.split('_')[1]
                logger.debug('workId: ', workId)
                const resp = await browser.storage.local.get(workId);
                logger.debug('local result: ', resp);
                if (resp[workId] && resp[workId].status === WorkStatus.Read) {
                    changeBlurbStyle(WorkStatus.Read, (worksOnPage[i].parentNode!));
                }
            }
        }
    }
}