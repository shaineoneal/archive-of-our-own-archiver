import { WorkBlurb } from "../works/WorkBlurb";
import { log } from "../utils/logger";
import { getWorkFromWorksPage } from '../pages/worksPage';

type ToggleType = {
    htmlTag: string,
    text: string,
    funcName: string,
    func: (work: HTMLElement) => void;
}

export enum TOGGLE {
    ADD_WORK,
    REMOVE_WORK,
}

export const toggleTypes: ToggleType[] = [
    {
        htmlTag: 'seen-work',
        text: 'Add Work',
        funcName: 'addWorkToSheet',
        func: (work) => { work.classList.add('seen-work'); }
    },
    {
        htmlTag: '',
        text: 'Remove Work',
        funcName: 'removeWorkFromSheet',
        func: (work) => { work.classList.remove('seen-work'); }
    }
]

export function createToggle(toggleType: ToggleType, work: Element): HTMLElement {
    
    const innerToggle = document.createElement('a');
    innerToggle.textContent = toggleType.text;
    innerToggle.className = 'toggle';

    innerToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        toggleType.func(work as HTMLElement);

        chrome.runtime.sendMessage({ message: toggleType.funcName, work: WorkBlurb.getWorkFromWorksPage(work)});
    });

    return innerToggle;

}