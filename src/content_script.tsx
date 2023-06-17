import $ from 'jquery';
import { log } from './utils/logger';



log('log: content_script.tsx loaded');
/*
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    log('log: message received');
    addTestText();
    sendResponse({ message: "message received" });
    return true;
});


function addTestText() {
    $('.heading').after("<h1>Test Text</h1>");
}*/

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    log("from background: " + request);
    sendResponse({ message: "message received" });
});

(async () => {
    await chrome.runtime.sendMessage(true);
})();