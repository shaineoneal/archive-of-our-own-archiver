import { Work } from '@/services';
import { sendMessage } from "@/services/messaging.ts";
import { changeBlurbStyle } from "@/utils/changeBlurbStyle.ts";
import { wrap } from "@/utils";
import '@/entrypoints/styles.scss';
import { WorkStatus } from "@/types/data.ts";

/**
 * Toggles for adding and removing works
 */
const TOGGLES = {
    add: 'Add Work',
    remove: 'Remove Work'
};

/**
 * Add blurb controls to the works on the page
 * @param worksOnPage - List of works on the page
 * @param boolRead - Array indicating if the works are read
 */
export function addBlurbControls(worksOnPage: NodeList, boolRead: boolean[]): void {
    worksOnPage.forEach((work, index) => {
        const workEl = work as Element;

        // Create a new div to wrap the work element
        const workWrap = document.createElement('div');
        workWrap.classList.add('blurb-with-toggles', 'archiver-controls');
        workWrap.id = `${workEl.id}-wrap`;
        //workWrap.style.cssText = JSON.stringify(getComputedStyle(workEl));

        // Wrap the work element in the new div
        wrap(work, workWrap);

        // Add the toggle controls to the new div
        const infoBox = document.createElement('li');
        infoBox.classList.add('blurb-toggle', 'archiver-controls', 'blurb', 'work', 'group');
        const workStyles = getComputedStyle(workEl);

        if(workStyles.cssText !== '') {
            infoBox.style.cssText = workStyles.cssText;
        } else {
            const cssText = Array.from(workStyles).reduce(
                (css, prop) => `${css}${prop}: ${workStyles.getPropertyValue(prop)};`,
            )
            infoBox.style.cssText = cssText;
        }
        infoBox.style.cssText = JSON.stringify(getComputedStyle(workEl));
        workWrap.appendChild(infoBox);

        // Add the controls
        infoBox.appendChild(addControls(workWrap));

        // Add the info box
        workWrap.insertBefore(infoBox, work);
    });
}

/**
 * Add work control to the work wrap
 * @param workWrap - The work wrap element
 * @returns The control element
 */
export function addWorkControl(workWrap: Element): HTMLElement {
    const innerToggle = document.createElement('a');
    const work = workWrap.querySelector("li[id*='work_']") as Element;
    const workId = work.id.split('_')[1];
    innerToggle.textContent = 'Add Work';
    innerToggle.className = 'toggle';

    innerToggle.addEventListener('click', async (e) => {
        e.preventDefault();

        logger.debug('addWork clicked!: ', work);

        const workBlurb = Work.fromBlurb(work);
        logger.debug('workBlurb: ', workBlurb);

        sendMessage('AddWorkToSpreadsheet', workBlurb).then((response: Work) => {
            logger.debug('content script response: ', response);
            if(response) {
                changeBlurbStyle(WorkStatus.Read, workWrap);
            }
            logger.debug('addWork error: ', response);
            return;
        });
    });

    return innerToggle;
}

/**
 * Remove work control from the work wrap
 * @param workWrap - The work wrap element
 * @returns The control element
 */
export function removeWorkControl(workWrap: Element): HTMLElement {
    const innerToggle = document.createElement('a');
    innerToggle.textContent = 'Remove Work';
    innerToggle.className = 'toggle';

    innerToggle.addEventListener('click', async (e) => {
        e.preventDefault();

        logger.debug('removeWork clicked!: ', workWrap);

        const workBlurb = Work.fromBlurb(workWrap);
        logger.debug('workBlurb.workId: ', workBlurb);

        //sendMessage(
        //    MessageName.RemoveWorkFromSheet,
        //    { workId: workBlurb.workId },
        //    (response: MessageResponse<boolean>) => {
        //        if (response.error) {
        //            logger.debug('removeWork error: ', response.error);
        //        } else {
        //            logger.debug('content script response: ', response.response);
        //            changeBlurbStyle(WorkStatus.Default, workWrap);
        //        }
        //    }
        //);
    });

    return innerToggle;
}

/**
 * Add controls to the work wrap
 * @param workWrap - The work wrap element
 * @returns The controls element
 */
export function addControls(workWrap: Element): Node {

    const work = workWrap.querySelector("li[id*='work_']") as Element;
    logger.debug('work: ', work);
    const workId = work.id.split('_')[1];

    const controls = document.createElement('ul');
    controls.className = 'blurb-controls actions';
    try {
        browser.storage.local.get(workId, (result) => {
            if (result && result[workId]) {
                controls.appendChild(incrementReadCountControl(workWrap));
                controls.appendChild(removeWorkControl(workWrap));
            } else {
                controls.appendChild(addWorkControl(workWrap));
            }
        });
    } catch (error) {
        logger.debug('Error getting workId from local storage: ', error);
    }

    return controls as Node;
}

/**
 * Add info to the work
 * @param work - The work element
 * @returns The info element
 */
export function addInfo(work: Element): Node {
    logger.debug('adding info to work: ', work);

    const workId = work.id.split('_')[1];
    logger.debug('workId: ', workId);

    const info = document.createElement('div');
    info.className = 'blurb-info';

    browser.storage.local.get(workId, (result) => {
        logger.debug('result from local store: ', result);
        const userWork = result[workId] as Work["info"];
        logger.debug('addInfo userWork: ', userWork);

        if (!userWork ) {
            logger.debug('work not found: ', work);
        }

        //if userWork.history exists,

        const history = userWork?.history
            ? typeof userWork.history === 'string'
                ? JSON.parse(userWork.history)
                : userWork.history
            : [];

        let dateStr = 'pre-2025';
        if (history.length !== 0) {
            const date = new Date(history[history.length - 1].date);
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            dateStr = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
        }
        info.className = 'blurb-info';

        const lastRead = document.createElement('p');
        lastRead.textContent = `Last read: ${dateStr}`;
        lastRead.classList.add('last-read', 'datetime');

        const readCount = document.createElement('p');
        readCount.textContent = `Read ${userWork?.readCount} time(s)`;
        readCount.classList.add('read-count', 'datetime');

        info.appendChild(lastRead);
        info.appendChild(readCount);
    });

    return info as Node;
}

/**
 * Increment read count control for the work wrap
 * @param workWrap - The work wrap element
 * @returns The control element
 */
function incrementReadCountControl(workWrap: Element): HTMLElement {
    const innerToggle = document.createElement('a');
    innerToggle.textContent = '+1';
    innerToggle.className = 'toggle';

    innerToggle.addEventListener('click', async (e) => {
        e.preventDefault();

        logger.debug('incrementReadCount clicked!: ', workWrap);

        const aWork = Work.fromBlurb(workWrap);
        logger.debug('awork: ', aWork);
        const workId = `${aWork.workId}`;

        browser.storage.local.get(workId, (result) => {
            if (!result[workId]) {
                return;
            }
            const uWork = result[aWork.workId] as Work["info"];
            logger.debug('uWork: ', uWork);
            if (!uWork) {
                throw new Error('work not found: ' + workWrap);
            }

            const history = uWork?.history
                ? typeof uWork.history === 'string'
                    ? JSON.parse(uWork.history)
                    : uWork.history
                : [];
            history.push({
                action: "reread",
                date: new Date().toLocaleString(),
            });
            logger.debug('hist', history);

            const work = new Work(
                aWork.workId,
                {
                    index: uWork.index,
                    title: uWork.title,
                    authors: uWork.authors,
                    fandoms: uWork.fandoms,
                    relationships: uWork.relationships,
                    tags: uWork.tags,
                    description: uWork.description,
                    wordCount: uWork.wordCount,
                    chapterCount: uWork.chapterCount,
                    status: uWork.status,
                    history: history,
                    chapters: uWork.chapters,
                    personalTags: uWork.personalTags,
                    rating: uWork.rating,
                    readCount: uWork.readCount! += 1,
                },
            );

            logger.debug('work', work);

            sendMessage('UpdateWorkInSpreadsheet', work).then((response) => {
                logger.debug('content script response: ', response);
                if (!response) {
                        logger.error('incrementReadCount error ');
                    } else {
                        logger.debug('content script responded');
                        changeBlurbStyle(WorkStatus.Read, workWrap);
                    }
                return;
            });
            //sendMessage(
            //    MessageName.UpdateWorkInSheet,
            //    { work: work },
            //    (response: MessageResponse<boolean>) => {
            //        if (response.error) {
            //            logger.debug('incrementReadCount error: ', response.error);
            //        } else {
            //            logger.debug('content script response: ', response.response);
            //            changeBlurbStyle(WorkStatus.Read, workWrap);
            //        }
            //    }
            //);
        });
    });

    return innerToggle;
}