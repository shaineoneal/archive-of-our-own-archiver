export function listLooksRead(tf: Boolean, work: Element) {

    if (tf) work.classList.add('read-work');

    else work.classList.remove('read-work');

}

export function looksRead(tf: Boolean) {

    if (tf) document.querySelector('dl.work.meta.group')!.classList.add('read-work');

    else document.querySelector('dl.work.meta.group')!.classList.remove('read-work');

}