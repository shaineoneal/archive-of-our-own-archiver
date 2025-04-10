import { createRoot } from "react-dom/client";
import { Chapter } from "@/entrypoints/content/Work.tsx";
import { Work } from "@/entrypoints/content/Work.tsx";

/**
 * Extracts and counts the words in the chapter text on the work page.
 * Logs the total word count, the number of written chapters, and the total number of chapters.
 */
export async function insideWorkPage(): Promise<void> {

    // Check if page already has loaded
    try {
        const progressBarContainer = document.querySelector('.progress-bar-container') as Element;
        if (progressBarContainer) {
            console.log('Progress bar already injected.')
            return;
        }
    }
    catch (error) {
        console.error('Error checking progress bar: ', error);
    }

    //const workId = ActiveWork.getWorkId();
    //console.log("insideWorkPage", workId);

    const workNode = document.querySelector('.work.meta.group') as Element;

    const activeChap = Chapter.getChapter();
    console.log('activeChap: ', activeChap);
    const work = Work.fromActiveWork(getEntireWorksPage());
    console.log('work: ', work);

    if (activeChap && activeChap.chapterNumber === 1) {
        console.log('first chapter');

        console.log('activeWork: ', work);
        //save work to local storage
        try {
            await browser.storage.local.set({[work.workId]: work});
            console.log('Work saved to local storage');
        } catch (error) {
            console.error('Error saving work to local storage: ', error);
        }
        console.log('work previous chapters: ', work.sumPreviousChapters(activeChap.chapterNumber));

    } else {
        const workIdStr = work.workId.toString();
        console.log(workIdStr);
        const storedWork = await browser.storage.local.get(workIdStr);
        console.log('storedWork: ', storedWork);
        if (storedWork) {
            console.log('storedWork found!!!: ', storedWork);
        }
        console.log('testing: ', work.sumPreviousChapters(activeChap.chapterNumber));

    }
    addChapterInfo(work, activeChap);
    const worksOnPage = getEntireWorksPage();
    parseChapterInfo(worksOnPage);
    console.log('worksOnPage: ', worksOnPage);

}


function addChapterInfo(work: Work, activeChap: Chapter): void {

    const chapterInfo = document.querySelector('.chapter.preface.group');

    const progressBarContainer = document.createElement('div');
    progressBarContainer.className = 'progress-bar-container';
    chapterInfo?.appendChild(progressBarContainer);

    if(!chapterInfo) {
        console.log('chapterInfo not found');
        return;
    }

    console.log('chapterInfo: ', chapterInfo);
    createRoot(progressBarContainer).render(work.createProgressBar(activeChap));
}

function getEntireWorksPage(): Document {
    console.log('logging', document.location.href)
    // use regex to only get the base url
    const url = document.location.href.match(/(https:\/\/archiveofourown.org\/works\/\d+)/)?.[0];
    console.log('url:', url);
    let request = new XMLHttpRequest();
    const parser = new DOMParser();

    request.open('GET', `${url}?view_full_work=true`, false);
    request.send(null);
    const doc = parser.parseFromString(request.response, "text/html");

    return doc;

}

function parseChapterInfo(doc: Document): void {
    const chapters = doc.querySelectorAll("#chapters > .chapter");
    console.log('chapters:', chapters);
    for (let i = 0; i < chapters.length; i++) {
        const work = Chapter.chapterFromNode(chapters[i]);
    }
}