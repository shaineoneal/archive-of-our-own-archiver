import '../../styles.css';
import log from '../../utils/logger';
import { Ao3_BaseWork } from './Ao3_BaseWork';
import { MessageName, sendMessage } from '../../utils/chrome-services';


export function addBlurbToggle(workWrap: Element) {

    const work = workWrap.firstChild! as HTMLElement;
    var on_list = false; //TODO: check if work is on list

    const innerToggle = document.createElement('a');
    innerToggle.textContent = 'Add Work';           //TODO: change for all buttons
    innerToggle.className = 'toggle';

    innerToggle.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        log('blurbToggle clicked!: ', work);

        const workBlurb = Ao3_BaseWork.createWork(work);
        log('workBlurb: ', workBlurb);
        chrome.runtime.sendMessage({message: 'addWorkToSheet', work: workBlurb}, (response) => {
            log('content script response: ', response);
            if (response.response === true) {
                log('response: ', response.response);
                work.classList.add('status-read');
            }
        });
    });

    log('blurbToggles: ', work);

    const toggle = work.cloneNode(false) as HTMLElement;
    toggle.className = 'blurb-toggle';
    toggle.removeAttribute('id');
    toggle.removeAttribute('role');

    toggle.appendChild(innerToggle);

    workWrap.insertBefore(toggle, workWrap.firstChild);
}
