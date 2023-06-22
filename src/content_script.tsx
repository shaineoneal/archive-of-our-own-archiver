import React from 'react';
import { log } from './utils/logger';
import { Work } from './works';
import { blurbToggles } from './components/blurbToggles';
//import "./styles.css";


log('log: content_script.tsx loaded');

function getLoadedWorks() {
  const works = Array.from(document.querySelectorAll('li.work, li.bookmark') as unknown as HTMLCollectionOf<HTMLElement>);
  return works;
}

log("works found: ", getLoadedWorks());

var searchList = new Array();
getLoadedWorks().forEach((work) => {
    work.style.marginTop = '31px';
    blurbToggles(work);
    //if its a bookmark, use the class to get the work id
    if(work.classList.contains('bookmark')) {
        searchList.push(work.classList[3].split('-')[1]);
    } else {    //else its a work, use the id to get the work id
        searchList.push(work.id.split('_')[1]);
    }
});

log("searchList: ", searchList);

const workId = searchList[1];

log("work: ", Work.getWorkFromPage(workId));
