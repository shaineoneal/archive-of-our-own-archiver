import { WorkStatus } from "@/utils/types/data.ts";
import { log } from "@/utils/logger.ts";
import { addControls, addInfo, addWorkControl, removeWorkControl } from "./blurbControls.tsx";
import { removeWorkFromSheet } from "@/utils/browser-services/removeWorkFromSheet.ts";

const STATUS_CLASSES = {
    reading: 'status-reading',
    toRead: 'status-to-read',
    skipped: 'status-skipped',
    dropped: 'status-dropped',
    read: 'status-read',
}

/**
 * Changes the style of a work element based on its work status.
 *
 * @param {WorkStatus} workStatus - The current status of the work.
 * @param workWrap
 */
export function changeBlurbStyle(workStatus: WorkStatus, workWrap: Node) {
    const wrapEl = workWrap as Element;
    const work = wrapEl.querySelector('.work');
    const workEl = work as Element;
    const toggleEl = wrapEl.querySelector('.blurb-toggle') as Element;

    log('wrapEl: ', wrapEl);
    log('toggleEl: ', toggleEl);
    log('workEl: ', workEl);

    switch (workStatus) {
        case 'reading':
            workEl.classList.add('status', STATUS_CLASSES.reading);
            break;
        case 'toRead':
            workEl.classList.add('status','status-to-read');
            break;
        case 'skipped':
            workEl.classList.add('status','status-skipped');
            break;
        case 'dropped':
            workEl.classList.add('status','status-dropped');
            break;
        case 'read':
            work!.classList.add('status','status-read');
            // remove controls and info
            if(toggleEl.querySelector('.blurb-controls')) toggleEl.removeChild(toggleEl.querySelector('.blurb-controls')!);
            if(toggleEl.querySelector('.blurb-info')) toggleEl.removeChild(toggleEl.querySelector('.blurb-info')!);
            // add back controls and info
            toggleEl.appendChild(addControls(wrapEl));
            toggleEl.appendChild(addInfo(workEl));
            break;
        default:
            (Object.keys(STATUS_CLASSES) as Array<keyof typeof STATUS_CLASSES>).forEach((status) => {
                workEl.classList.remove(STATUS_CLASSES[status]);
            });
            workEl.querySelectorAll('.status').forEach((statusEl) => { statusEl.remove() });
            toggleEl.querySelectorAll('.blurb-info').forEach((infoEl) => { infoEl.remove() });
            toggleEl.querySelectorAll('.toggle').forEach((toggleEl) => { toggleEl.remove() });
            if(toggleEl.querySelector('.blurb-controls')) toggleEl.removeChild(toggleEl.querySelector('.blurb-controls')!);
            toggleEl.appendChild(addControls(wrapEl));
            break;
    }
    log('work: ', workEl);
    return workEl;
}