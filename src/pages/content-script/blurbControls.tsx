import '../../styles.css';
import log from '../../utils/logger';
import { Ao3_BaseWork } from './Ao3_BaseWork';
import { MessageName, sendMessage } from "../../utils/chrome-services/messaging";
import { wrap } from "../../utils";

const TOGGLES = {
    add: 'Add Work',
    remove: 'Remove Work'
}

export function addBlurbControls(worksOnPage: HTMLElement[]) {
    log('addBlurbControls worksOnPage: ', worksOnPage);
    worksOnPage.forEach((work) => {
        let newEl = document.createElement('div');
        newEl.classList.add('blurb-with-toggles');

        newEl.style.cssText = JSON.stringify(getComputedStyle(work));

        wrap(work, newEl);

        const workId = work.id.split('_')[1];

        const toggle = work.cloneNode(false) as HTMLElement;
        toggle.className = 'blurb-toggle';
        toggle.removeAttribute('id');
        toggle.removeAttribute('role');

        if(work.classList.contains('status-read')) {
            toggle.appendChild(removeWorkControl(newEl));
        } else {
            toggle.appendChild(addWorkControl(newEl));
        }

        if(work && work.parentNode) {
            work.parentNode.insertBefore(toggle, work);
        }
    });
   // const work = workWrap.firstChild! as HTMLElement;
    let on_list = false; //TODO: check if work is on list

    //const toggle = work.cloneNode(false) as HTMLElement;
    //toggle.className = 'blurb-toggle';
    //toggle.removeAttribute('id');
    //toggle.removeAttribute('role');

    //toggle.appendChild(addWorkControl(work));
    //toggle.appendChild(removeWorkControl(work));

    //workWrap.insertBefore(toggle, workWrap.firstChild);
}

function addWorkControl(work: HTMLElement) {
    const innerToggle = document.createElement('a');
    innerToggle.textContent = 'Add Work';
    innerToggle.className = 'toggle';

    innerToggle.addEventListener('click', async (e) => {
        e.preventDefault();

        log('blurbToggle clicked!: ', work);

        const workBlurb = Ao3_BaseWork.createWork(work);
        log('workBlurb: ', workBlurb);

        sendMessage(
            MessageName.AddWorkToSheet,
            {work: workBlurb},
            (response) => {
                log('content script response: ', response);
                if (response === true) {
                    log('response: ', response);
                    work.classList.add('status-read');
                }   //else popup login
            }
        )
    });

    return innerToggle;
}

function removeWorkControl(work: HTMLElement) {
    const innerToggle = document.createElement('a');
    innerToggle.textContent = 'Remove Work';
    innerToggle.className = 'toggle';

    innerToggle.addEventListener('click', async (e) => {
        e.preventDefault();

        log('blurbToggle clicked!: ', work);

        const workBlurb = Ao3_BaseWork.createWork(work);
        log('workBlurb: ', workBlurb);

        sendMessage(
            MessageName.RemoveWorkFromSheet,
            {workId: workBlurb.workId},
            (response) => {
                log('content script response: ', response);
                if (response === true) {
                    log('response: ', response);
                    work.classList.remove('status-read');
                }   //else popup login
            }
        )
    });

    return innerToggle;
}