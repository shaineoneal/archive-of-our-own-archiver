

/* <div class="toggle-box flex-container">
 *    [[INNER TOGGLES]]
 * </div>
 */


export function addToggleBox(workWrap: Element) {
    const work = workWrap.firstChild! as HTMLElement;

    const toggleBox = document.createElement('li');
    toggleBox.classList.add('toggle-box');
    toggleBox.classList.add('flex-container');
    //toggleBox.removeAttribute('id');
    //toggleBox.removeAttribute('role');
    workWrap.insertBefore(toggleBox, workWrap.firstChild);

    return toggleBox;
}



export function addToggleToBox(toggleBox: Element, innerToggle: Element) {
    toggleBox.appendChild(innerToggle);
}