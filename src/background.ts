import { google } from 'googleapis';

function polling() {
  // console.log("polling");
  setTimeout(polling, 1000 * 30);
}

polling();


chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL("popup.html") });
});

