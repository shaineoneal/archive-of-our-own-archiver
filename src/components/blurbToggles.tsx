import { log } from '../utils/logger';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createRoot } from 'react-dom/client';


export function blurbToggles(workWrap: Element) {

    var on_list = false;    //TODO: check if work is on list

    workWrap.classList.add("blurb-with-toggles");

    
    var linkBox = document.createElement("div");
    var temp = document.createElement("a");
    var link = document.createTextNode(on_list ? "Remove Work" : "Add Work")
    temp.style.borderBottom = '1px dotted';
    temp.appendChild(link);
    linkBox.appendChild(temp);
    linkBox.classList.add("blurb-toggles");

    linkBox.style.display = 'block';
    linkBox.style.position = 'relative';
    linkBox.style.border = '1px solid #555';
    linkBox.style.borderBottom = 'none';
    linkBox.style.padding = '5px';
    linkBox.style.lineHeight = '12px';
    linkBox.style.fontSize = '10px';
    linkBox.style.boxShadow = 'none';


    

    workWrap.insertBefore(linkBox, workWrap.firstChild);
    return linkBox;

}

