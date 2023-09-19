
export function readWork(work: Element, dateFinished: number) {

    work.classList.add('read-work');

    const date = new Date(dateFinished);

    return work;
}