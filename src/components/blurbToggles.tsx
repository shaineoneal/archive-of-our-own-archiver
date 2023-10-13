import '../styles.css';
import { log } from '../utils/logger';
import { WorkBlurb } from '../works/WorkBlurb';
import { enumKeys } from '../utils';

import ReactDOM from 'react-dom';
import { addStars } from './stars';


/**
 * 
 * @param workWrap 
 * @returns 
 

export function addToggles(workWrap: Element) {

    //const work = workWrap.firstChild! as HTMLElement;
    //var on_list = false; //TODO: check if work is on list
//
    //const toggle = work.cloneNode(false) as HTMLElement;
    //toggle.className = 'blurb-toggles';
    //toggle.removeAttribute('id');
    //toggle.removeAttribute('role');
    //workWrap.insertBefore(toggle, workWrap.firstChild);
    
    for (const index in toggleTypes) {

        const innerToggle = document.createElement('a');
        innerToggle.textContent = toggleTypes[index].text;           //TODO: change for all buttons
        innerToggle.className = 'toggle';

        innerToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            log('blurbToggle clicked!: ', work);
            log('testing: ', toggleTypes[index].funcName, WorkBlurb.createWork(work));

            chrome.runtime.sendMessage({message: toggleTypes[index].funcName, work: WorkBlurb.createWork(work)});
            
            log(chrome.storage.sync.get('lastRow'));

            toggleTypes[index].func(work);
        });

        //ReactDOM.render(<Stars />, innerToggle);

        log('blurbToggles: ', work);
        toggle.appendChild(innerToggle);
        addStars(toggle);
        
        
    }
}
*/