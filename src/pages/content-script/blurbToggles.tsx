import '../../styles.css';
import log from '../../utils/logger';
import { WorkBlurb } from './WorkBlurb';

/**
 * 
 * @param workWrap 
 * @returns 
 */

export function addBlurbToggle(workWrap: Element) {

    const work = workWrap.firstChild! as HTMLElement;
    var on_list = false; //TODO: check if work is on list

    const innerToggle = document.createElement('a');
    innerToggle.textContent = 'Add Work';           //TODO: change for all buttons
    innerToggle.className = 'toggle';

    innerToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        log('blurbToggle clicked!: ', work);

        chrome.runtime.sendMessage({message: 'addWorkToSheet', work: WorkBlurb.createWork(work)});
        work.classList.add('read-work');
    });

    log('blurbToggles: ', work);

    const toggle = work.cloneNode(false) as HTMLElement;
    toggle.className = 'blurb-toggle';
    toggle.removeAttribute('id');
    toggle.removeAttribute('role');

    toggle.appendChild(innerToggle);

    workWrap.insertBefore(toggle, workWrap.firstChild);
}
