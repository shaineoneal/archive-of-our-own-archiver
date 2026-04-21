import { createRoot } from "react-dom/client";
import { Chapter, Work } from "@/models";

/**
 * Extracts and counts the words in the chapter text on the work page.
 * Logs the total word count, the number of written chapters, and the total number of chapters.
 */
export async function insideWorkPage(): Promise<void> {

    // Check if page already has loaded
    try {
        const progressBarContainer = document.querySelector('.progress-bar-container') as Element;
        if (progressBarContainer) {
            logger.debug('Progress bar already injected.')
            return;
        }
    }
    catch (error) {
        console.error('Error checking progress bar: ', error);
    }

    //const workId = ActiveWork.getWorkId();
    //logger.debug("insideWorkPage", workId);

    const workNode = document.querySelector('.work.meta.group') as Element;

    const activeChap = Chapter.getChapter();
    logger.debug('activeChap: ', activeChap);
    // is work already in storage?
    const fullWork = Work.fromActiveWork(await getFullWork());
    logger.debug('full_work: ', fullWork.info);
    const workIdStr = fullWork.workId.toString();

    try {
        //is work in storage already?
        const storedWork = await browser.storage.local.get(workIdStr);

        if (storedWork[workIdStr]) {
            logger.debug('stored work: ', storedWork[workIdStr]);
        }
        else {
            //save work to session storage
            try {
                await browser.storage.local.set({[fullWork.workId]: fullWork.info});
                logger.debug('Work saved to local storage');
            } catch (error) {
                console.error('Error saving work to local storage: ', error);
            }
        }
    } catch (e) {
        console.error(e);
    }

    addChapterInfo(fullWork, activeChap);
}

function addChapterInfo(work: Work, activeChap: Chapter): void {

    const chapterInfo = document.querySelector('.chapter.preface.group');

    const progressBarContainer = document.createElement('div');
    progressBarContainer.className = 'progress-bar-container';
    chapterInfo?.appendChild(progressBarContainer);

    if(!chapterInfo) {
        logger.debug('chapterInfo not found');
        return;
    }

    logger.debug('chapterInfo: ', chapterInfo);
    createRoot(progressBarContainer).render(work.createProgressBar(activeChap));
}

async function getFullWork(): Promise<Document> {
    logger.debug('logging', document.location.href)
    // use regex to only get the base url
    const url = document.location.href.match(/(https:\/\/archiveofourown.org\/works\/\d+)/)?.[0];
    logger.debug('url:', url);

    const response = await fetch(`${url}?view_full_work=true`);
    const text = await response.text();

    const parser = new DOMParser();
    return parser.parseFromString(text, "text/html");

}

function parseChapterInfo(doc: Document): void {
    const chapters = doc.querySelectorAll("#chapters > .chapter");
    logger.debug('chapters:', chapters);
    for (let i = 0; i < chapters.length; i++) {
        const work = Chapter.chapterFromNode(chapters[i]);
    }
}