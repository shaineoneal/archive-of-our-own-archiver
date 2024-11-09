import { WorkStatus } from "../../utils/types/data";

/**
 * Changes the style of a work element based on its work status.
 *
 * @param {WorkStatus} workStatus - The current status of the work.
 * @param {Element} work - The DOM element representing the work.
 */
export function changeBlurbStyle(workStatus: WorkStatus, work: Element) {
    switch (workStatus) {
        case 'reading':
            work.classList.add('status-reading');
            break;
        case 'toRead':
            work.classList.add('status-to-read');
            break;
        case 'skipped':
            work.classList.add('status-skipped');
            break;
        case 'dropped':
            work.classList.add('status-dropped');
            break;
        case 'read':
            work.classList.add('status-read');
            break;
        default:
            break;
    }
}