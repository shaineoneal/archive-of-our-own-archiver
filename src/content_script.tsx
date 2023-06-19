import { log } from './utils/logger';

log('log: content_script.tsx loaded');

function getLoadedWorks() {
  const works = document.querySelectorAll('li.work, li.bookmark');
  return works;
}

log("works found: ", getLoadedWorks());

var workList = new Array();
getLoadedWorks().forEach((work) => {
    //if its a bookmark, use the class to get the work id
    if(work.classList.contains('bookmark')) {
        workList.push(work.classList[3].split('-')[1]);
    } else {    //else its a work, use the id to get the work id
        workList.push(work.id.split('_')[1]);
    }
});

log("workList: ", workList);