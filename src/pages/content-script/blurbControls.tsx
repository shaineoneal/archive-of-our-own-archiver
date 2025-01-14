import '../../styles.css';
import log from '../../utils/logger';
import { Ao3_BaseWork } from './Ao3_BaseWork';
import { MessageName, sendMessage } from "../../utils/chrome-services/messaging";

const toggleOptions = {
    add: 'Add Work',
    remove: 'Remove Work',
}

export function addBlurbControls(workWrap: Element) {

    const work = workWrap.firstChild! as HTMLElement;
    let on_list = false; //TODO: check if work is on list


    workWrap.insertBefore(addWorkControl(work), workWrap.firstChild);
    workWrap.insertBefore(removeWorkControl(work), workWrap.firstChild);
}

function addWorkControl(work: HTMLElement) {
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

    return toggle;
}

function removeWorkControl(work: HTMLElement) {
    const innerToggle = document.createElement('a');
    innerToggle.textContent = 'Remove Work';           //TODO: change for all buttons
    innerToggle.className = 'toggle';

    innerToggle.addEventListener('click', async (e) => {

        log('remove work clicked!: ', work);

        const workBlurb = Ao3_BaseWork.createWork(work);
        log('workBlurb: ', workBlurb);

        sendMessage(
            MessageName.RemoveWorkFromSheet,
            {workId: workBlurb.workId},
            (response) => {
                log('content script response: ', response);
                if (response!) {
                    log('response: ', response);
                    work.classList.remove('status-read');
                }   //else popup login
            }
        )
    });
    const toggle = work.cloneNode(false) as HTMLElement;
    toggle.className = 'blurb-toggle';
    toggle.removeAttribute('id');
    toggle.removeAttribute('role');

    toggle.appendChild(innerToggle);

    return toggle;
}