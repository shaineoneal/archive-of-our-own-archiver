import '../../styles.css';
import log from '../../utils/logger';
import { Ao3_BaseWork } from './Ao3_BaseWork';
import { MessageName, sendMessage } from "../../utils/chrome-services/messaging";
import { wrap } from "../../utils";
import { changeBlurbStyle } from "./changeBlurbStyle";
import { convertToAO3Date, getStore, setStore, StoreMethod } from "../../utils/chrome-services";
import { User_BaseWork } from "./User_BaseWork";

const TOGGLES = {
    add: 'Add Work',
    remove: 'Remove Work'
}

export function addBlurbControls(worksOnPage: NodeList, boolRead: boolean[]) {
    log('addBlurbControls worksOnPage: ', worksOnPage);
    worksOnPage.forEach((work, index) => {
        const workEl = work as Element;
        const workIdClass = workEl.id.split('_')[1];

        log('workIdClass: ', workIdClass);

        // Create a new div to wrap the work element
        let workWrap = document.createElement('div');
        workWrap.classList.add('blurb-with-toggles', 'archiver-controls', workIdClass);

        workWrap.style.cssText = JSON.stringify(getComputedStyle(workEl));

        // Wrap the work element in the new div
        wrap(work, workWrap);

        // Add the toggle controls to the new div
        let infoBox = document.createElement('li');
        infoBox.classList.add('blurb-toggle', 'archiver-controls');
        workWrap.appendChild(infoBox);

        // If the work is already on the list, add the increment and the remove control
        // Otherwise, add the add control
        infoBox.appendChild(addControls(workWrap));

        // Add the info box
        workWrap.insertBefore(infoBox, work);

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

export function addWorkControl(workWrap: Element) {
    const innerToggle = document.createElement('a');
    innerToggle.textContent = 'Add Work';
    innerToggle.className = 'toggle';

    innerToggle.addEventListener('click', async (e) => {
        e.preventDefault();

        log('addWork clicked!: ', workWrap);

        const workBlurb = Ao3_BaseWork.createWork(workWrap);
        log('workBlurb: ', workBlurb);
        const work = workWrap.querySelector('.work') as Element;


        sendMessage(
            MessageName.AddWorkToSheet,
            {work: workBlurb},
            (response) => {
                log('content script response: ', response);
                if (response) {
                    log('response: ', response);
                    changeBlurbStyle('read', workWrap);

                }   //else popup login
            }
        )
    });

    return innerToggle;
}

export function removeWorkControl(workWrap: Element) {
    const innerToggle = document.createElement('a');
    innerToggle.textContent = 'Remove Work';
    innerToggle.className = 'toggle';

    innerToggle.addEventListener('click', async (e) => {
        e.preventDefault();

        log('removeWork clicked!: ', workWrap);

        const workBlurb = Ao3_BaseWork.createWork(workWrap);
        log('workBlurb.workId: ', workBlurb.workId);

        const work = workWrap.querySelector('.work') as Element;

        sendMessage(
            MessageName.RemoveWorkFromSheet,
            {workId: workBlurb.workId},
            (response) => {
                log('content script response: ', response);
                if (response) {
                    log('response: ', response);
                    changeBlurbStyle('', workWrap);
                }   //else popup login
                 // @ts-ignore
                    if (response.error) {   // @ts-ignore
                        log('error: ', response.error);
                    }

            }
        )
    });

    return innerToggle;
}

export function addControls(workWrap: Element): Node {
    log('adding controls to work: ', workWrap);

    const work = workWrap.querySelector('.work') as Element;

    const workId = work.id.split('_')[1];
    log('workId: ', workId);

    let controls = document.createElement('div');
    controls.className = 'blurb-controls';
    chrome.storage.session.get(workId, (result) => {
        if (!result[workId]) {
            controls.appendChild(addWorkControl(workWrap));
        }
        else {
            controls.appendChild(incrementReadCountControl(workWrap));
            controls.appendChild(removeWorkControl(workWrap));
        }
    });

    return controls as Node;
}

export function addInfo(work: Element) {
    log('adding info to work: ', work);

    const workId = work.id.split('_')[1];
    log('workId: ', workId);

    let info = document.createElement('div');

    chrome.storage.session.get(workId, (result) => {
        log('result from session store: ', result);
        const userWork = result[workId];
        log('userWork: ', userWork);
        log('userWork.history: ', userWork.history);

        const history = userWork.history
            ? typeof userWork.history === 'string'
                ? JSON.parse(userWork.history)
                : userWork.history
            : [];

        //log('history: ', history[history.length - 1].toLocaleDateString(""));
        //log('testing', convertToAO3Date(history[history.length - 1]));

        let dateStr = 'pre-2025';
        if(history.length !== 0) {
            let date = new Date(history[history.length - 1].date);
            let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            dateStr = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
        }
        info.className = 'blurb-info';



        const lastRead = document.createElement('p');
        lastRead.textContent = `Last read: ${dateStr}`;
        lastRead.classList.add('last-read', 'datetime');

        const readCount = document.createElement('p');
        readCount.textContent = `Read ${userWork.readCount} time(s)`;
        readCount.classList.add('read-count', 'datetime');

        info.appendChild(lastRead);
        info.appendChild(readCount);


    });
    const blurbInfo = document.querySelector('.blurb-info') as Node;
    log('blurbInfo: ', info);

    return info as Node;
}

function incrementReadCountControl(workWrap: Element) {
    const innerToggle = document.createElement('a');
    innerToggle.textContent = '+1';
    innerToggle.className = 'toggle';

    innerToggle.addEventListener('click', async (e) => {
        e.preventDefault();

        log('incrementReadCount clicked!: ', workWrap);

        const aWork = Ao3_BaseWork.createWork(workWrap);
        const workId = `${aWork.workId}`;

        chrome.storage.session.get(workId, (result) => {
            if (!result[workId]) {
                return;
            }
            const uWork = result[aWork.workId];
            log('uWork: ', uWork);

            uWork.readCount += 1;
            const history = uWork.history
                ? typeof uWork.history === 'string'
                    ? JSON.parse(uWork.history)
                    : uWork.history
                : [{action: "added", date: 'pre-2025'}];
            history.push({
                action: "reread",
                date: new Date().toLocaleString(),
            });
            log('hist', history);

            let work = new User_BaseWork(
                aWork.workId,
                uWork.index,
                uWork.status,
                history,
                uWork.personalTags,
                uWork.rating,
                uWork.readCount,
                uWork.skipReason
            );

            sendMessage(
                MessageName.UpdateWorkInSheet,
                {work: work},
                (response) => {
                    log('content script response: ', response);
                    if (response) {
                        log('response: ', response);

                        changeBlurbStyle('read', workWrap);
                    }   //else popup login
                }
            )
        });
    });

    return innerToggle;
}