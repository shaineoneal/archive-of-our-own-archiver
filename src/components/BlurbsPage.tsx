import { sendMessage } from "@/services/messaging.ts";
import { changeBlurbStyle } from '../utils/changeBlurbStyle.ts';
import { WorkStatus } from "@/types/data.ts";
import { Work } from "@/services";

export async function standardBlurbsPage() {

    // 1. Scrape the page for Work IDs
    const workIdsOnPage = Array.from(document.querySelectorAll('li.work.blurb'))
        .map(el => el.id.split('_')[1]);

    // 2. Ask the background script to query only these IDs
    if (workIdsOnPage.length > 0) {
        logger.debug('workIdsOnPage: ', workIdsOnPage);
        await sendMessage('QuerySpreadSheet', workIdsOnPage);
    }

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
                const storedWork = resp[workId] as Work["info"] | undefined;
                if (storedWork?.status === WorkStatus.Read) {
                    changeBlurbStyle(WorkStatus.Read, (worksOnPage[i].parentNode!));
                }
            }
        }
    }
}