import { WorkStatus } from "../data";
import { BlurbWork } from "../works/BlurbWork";


type ToggleType = {
    togTag: string,
    htmlTag: string,
    text: string,
    funcName: string,
    status: WorkStatus,
    func: (work: HTMLElement) => void;
}

export enum TOGGLE {
    SEEN_WORK = 'read',
    REMOVE_WORK = '',
    SKIP_WORK = 'skipped'
}

export const toggleTypes: ToggleType[] = [
    {
        togTag: 'seen-work',
        htmlTag: 'seen-work',
        text: 'Add Work',
        funcName: 'markWorkAsSeen',
        status: TOGGLE.SEEN_WORK,
        func: (work) => { work.classList.add('seen-work'); }
    },
    {
        togTag: 'remove-work',
        htmlTag: '',
        text: 'Remove Work',
        funcName: 'removeWorkFromSheet',
        status: TOGGLE.REMOVE_WORK,
        func: (work) => { work.classList.remove('seen-work'); }
    },
    {
        togTag: 'skip-work',
        htmlTag: 'skipped-work',
        text: 'Mark as Skipped',
        funcName: 'markWorkAsSkipped',
        status: TOGGLE.SKIP_WORK,
        func: (work) => { work.classList.add('skipped-work'); }
    }
]

export function createToggle(toggleType: ToggleType, work: Element): HTMLElement {
    
    const innerToggle = document.createElement('a');
    innerToggle.textContent = toggleType.text;
    innerToggle.className = 'toggle';
    innerToggle.classList.add(toggleType.togTag);

    innerToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        toggleType.func(work as HTMLElement);

        chrome.runtime.sendMessage({ message: toggleType.funcName, work: BlurbWork.getWorkFromBlurb(work, toggleType.status)});
    });

    return innerToggle;

}