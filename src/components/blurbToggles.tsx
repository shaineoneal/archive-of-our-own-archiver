import { log } from '../utils/logger';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createRoot } from 'react-dom/client';


export function blurbToggles(work: Element) {

    var on_list = false;    //TODO: check if work is on list

    work.classList.add("blurb-with-toggles");


    
    var toggleButtons = document.createElement("a");
    var innerButtons = document.createTextNode(on_list ? "Remove Work" : "Add Work")
    toggleButtons.appendChild(innerButtons);
    toggleButtons.classList.add("blurb-toggles");

    toggleButtons.style.display = 'block';
    toggleButtons.style.position = 'absolute';
    toggleButtons.style.top = '-22px';
    toggleButtons.style.right = '-1px';
    toggleButtons.style.border = '1px solid #555';
    toggleButtons.style.padding = '5px';
    toggleButtons.style.lineHeight = '10px';

    work.insertBefore(toggleButtons, work.firstChild);
    return toggleButtons;

}

