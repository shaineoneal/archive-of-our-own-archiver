export function looksSeen(tf: Boolean, work: Element) {

    //if true, add class 'seen-work' to work element
    if (tf) work.classList.add('seen-work');
    //if false, remove class 'seen-work' from work element
    else work.classList.remove('seen-work');

}
