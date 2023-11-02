
export class BlurbToggles {

    static addToggleBox(workWrap: Element) {
        const work = workWrap.firstChild! as HTMLElement;

        const toggleBox = document.createElement('ul');
        toggleBox.classList.add('toggle-box');
        toggleBox.classList.add('flex-container');
        //toggleBox.removeAttribute('id');
        //toggleBox.removeAttribute('role');
        workWrap.insertBefore(toggleBox, workWrap.firstChild);

        return toggleBox;
        /* <div class="toggle-box flex-container">
         *    [[INNER TOGGLES]] 
         * </div>
         */
    }
}