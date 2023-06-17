import { log } from './utils/logger';

console.log('content_script.tsx loaded');


//async function getURL() {
//    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
//    const activeTab = tabs[0];
//    const url = activeTab.url;
//    log('url', url);
//    return url;
//}

log('log: content_script.tsx loaded');
//chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
//    if (changeInfo.status === 'complete') {
//        const url = await getURL();
//        if (url) {
//            chrome.runtime.sendMessage({ url });
//        }
//    }
//});