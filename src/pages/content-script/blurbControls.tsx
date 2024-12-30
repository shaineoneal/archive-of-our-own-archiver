import '../../styles.css';
import log from '../../utils/logger';
import { Ao3_BaseWork } from './Ao3_BaseWork';
import { MessageName, sendMessage } from "../../utils/chrome-services/messaging";


export function addBlurbControls(workWrap: Element) {

    const work = workWrap.firstChild! as HTMLElement;
    let on_list = false; //TODO: check if work is on list

    const innerToggle = document.createElement('a');
    innerToggle.textContent = 'Add Work';           //TODO: change for all buttons
    innerToggle.className = 'toggle';

    innerToggle.addEventListener('click', async (e) => {
        e.preventDefault();

        log('blurbToggle clicked!: ', work);

        const workBlurb = Ao3_BaseWork.createWork(work);
        log('workBlurb: ', workBlurb);

        sendMessage(
            MessageName.AddWorkToSheet,
            { work: workBlurb },
            (response) => {
                log('content script response: ', response);
                if (response === true) {
                    log('response: ', response);
                    work.classList.add('status-read');
                }   //else popup login
            }
        )

        //chrome.runtime.sendMessage({message: 'addWorkToSheet', work: workBlurb}, (response) => {
        //    log('content script response: ', response);
        //    if (response === true) {
        //        log('response: ', response);
        //        work.classList.add('status-read');
        //    }   //else popup login
        //});
    });

    const toggle = work.cloneNode(false) as HTMLElement;
    toggle.className = 'blurb-toggle';
    toggle.removeAttribute('id');
    toggle.removeAttribute('role');

    toggle.appendChild(innerToggle);

    workWrap.insertBefore(toggle, workWrap.firstChild);
}
