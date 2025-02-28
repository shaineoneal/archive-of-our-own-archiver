import { sendMessage } from "@/utils/browser-services/messaging.ts";
import { MessageResponse } from "@/utils/types/MessageResponse";
import { addBlurbControls } from './blurbControls.tsx';
import { changeBlurbStyle } from './changeBlurbStyle.tsx';
import { WorkStatus } from "@/utils/types/data.ts";

export async function standardBlurbsPage() {
    // check if page already has work statuses
    const workStatuses = document.querySelectorAll('.blurb-with-toggles') as NodeList;
    if (workStatuses.length > 0) {
        console.log('Work statuses already injected.')
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

    console.log('searchList: ', searchList);



    const resp = await sendMessage('QuerySpreadSheet', searchList);
    console.log('QuerySpreadSheet response: ', resp);
    if (resp.length == 0) {
        console.log('No work statuses to inject.')
        addBlurbControls(worksOnPage, []);
        return;
    }
    //if (resp.error) {
    //    console.log('Error querying spreadsheet: ', resp.error);
    //    return;
    //}
    else {
        await injectWorkStatuses(worksOnPage, resp);
        console.log('Injected work statuses.');
        addBlurbControls(worksOnPage, resp);
    }
    //sendMessage(
    //    MessageName.QuerySpreadsheet,
    //    { list: searchList },
    //    async (response: MessageResponse<boolean[]>) => {
    //        console.log('QuerySpreadsheet response: ', response)
    //        if (response === null) {
    //            console.log('No work statuses to inject.')
    //            addBlurbControls(worksOnPage, []);
    //            return;
    //        }
    //        if (response.error) {
    //            console.log('Error querying spreadsheet: ', response.error);
    //            return;
    //        }
    //        await injectWorkStatuses(worksOnPage, response.response);
    //        console.log('Injected work statuses.');
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
        response.forEach((workRef: boolean, index: number) => {
            console.log('workRef: ', workRef)
            if (workRef) {
                const workId = (worksOnPage[index] as Element).id.split('_')[1]
                browser.storage.session.get(workId, (result) => {
                    console.log('session result: ', result);
                    if (result[workId] && result[workId].status === WorkStatus.Read) {
                        changeBlurbStyle(WorkStatus.Read, (worksOnPage[index].parentNode!));
                    }
                });
            }
        });
    }
}