import { addWorkToSheet } from "./chrome-services/utils/appendToSheet";
import { blurbToggles } from "./components/blurbToggles";
import { log } from "./utils/logger";
import { wrap } from "./utils/wrapper";
import { Work } from "./works";



log("log: content_script.tsx loaded");

const works = Array.from(
  document.querySelectorAll(
    "li.work, li.bookmark"
  ) as unknown as HTMLCollectionOf<HTMLElement>
);

var searchList = new Array();
works.forEach((work) => {
  var newEl = document.createElement("div");
  newEl.style.boxShadow = "1px 1px 3px #000";
  newEl.style.height = "calc(100% - 1px)";

  wrap(work, newEl);

  work.style.marginTop = "0px";
  work.style.boxShadow = "none";

  blurbToggles(newEl);
  //if its a bookmark, use the class to get the work id
  if (work.classList.contains("bookmark")) {
    searchList.push(work.classList[3].split("-")[1]);
  } else {
    //else its a work, use the id to get the work id
    searchList.push(work.id.split("_")[1]);
  }
});

log("searchList: ", searchList);

const workId = searchList[1];

log("work: ", Work.getWorkFromPage(workId));
addWorkToSheet(Work.getWorkFromPage(workId))?.then((response) => {
  log("response: ", response);
});
