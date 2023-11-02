import { BlurbWork } from "../works/BlurbWork";


type ToggleType = {
    togTag: string,
    htmlTag: string,
    text: string,
    funcName: string,
    func: (work: HTMLElement) => void;
}

export enum TOGGLE {
    SEEN_WORK,
    REMOVE_WORK,
    SKIP_WORK
}

export const toggleTypes: ToggleType[] = [
    {
        togTag: 'add-work',
        htmlTag: 'seen-work',
        text: 'Add Work',
        funcName: 'markWorkAsSeen',
        func: (work) => { work.classList.add('seen-work'); }
    },
    {
        togTag: 'remove-work',
        htmlTag: '',
        text: 'Remove Work',
        funcName: 'removeWorkFromSheet',
        func: (work) => { work.classList.remove('seen-work'); }
    },
    {
        togTag: 'skip-work',
        htmlTag: 'skipped-work',
        text: 'Mark as Skipped',
        funcName: 'markWorkAsSkipped',
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

        chrome.runtime.sendMessage({ message: toggleType.funcName, work: BlurbWork.getWorkFromBlurb(work,)});
    });

    return innerToggle;

}