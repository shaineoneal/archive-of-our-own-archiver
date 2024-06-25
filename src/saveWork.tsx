import { renderToStaticMarkup } from 'react-dom/server';
import { log } from './utils/logger';

log('saveWork loaded');

export const workButtons = () => {
    var on_list = false;

    const innerButtons = <>{on_list ? 'Remove Work' : 'Add Work'}</>;

    var workButtons = document.createElement('a');
    workButtons.innerHTML = renderToStaticMarkup(innerButtons);

    return workButtons;
};

/*export const workButtons: React.ReactNode = () => {

    var on_list = false;
    return (
        <a>
          {on_list ? "Remove Work" : "Add Work"}
        </a>
    )
}*/
