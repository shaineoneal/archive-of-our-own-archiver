import { log } from '../utils/logger';
import '../styles.css';

export function blurbToggles(workWrap: Element) {
    var on_list = false; //TODO: check if work is on list

    workWrap.classList.add('blurb-with-toggles');

    workWrap.insertAdjacentHTML(
        'beforebegin',
        '<div class="blurb-toggles"><a class= "toggle">Add Work</a></div>'
    );

    return blurbToggles;
}
