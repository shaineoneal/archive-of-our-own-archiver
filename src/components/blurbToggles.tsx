import { log } from '../utils/logger';
import '../styles.css';
import { addWorkToSheet } from '../chrome-services';
import { Work } from '../works';

/**
 * 
 * @param workWrap 
 * @returns 
 */

export function blurbToggle(workWrap: Element, port: chrome.runtime.Port) {

    const work = workWrap.firstChild!;
    var on_list = false; //TODO: check if work is on list

    const innerToggle = document.createElement('a');
    innerToggle.textContent = 'Add Work';           //TODO: change for all buttons
    innerToggle.className = 'toggle';

    innerToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        log('blurbToggle clicked!: ', work);

        port.postMessage({message: 'addWorkToSheet', work: Work.createWork(work as HTMLElement)});
    });

    log('blurbToggles: ', work);

    const toggle = work.cloneNode(false) as HTMLElement;
    toggle.className = 'blurb-toggle';
    toggle.removeAttribute('id');
    toggle.removeAttribute('role');

    toggle.appendChild(innerToggle);

    workWrap.insertBefore(toggle, workWrap.firstChild);

    return blurbToggle;
}
