//import { google } from 'googleapis';

import { doesUserHaveRefreshToken, HttpMethod, makeRequest, retrieveAccessToken, verifyAccessToken } from "./chrome-services";
import log from "./utils/logger"

chrome.storage.onChanged.addListener((changes, namespace) => {
    for(const [key, { oldValue, newValue }] of Object.entries(changes)) {
        log(`Storage key "${key}" in namespace "${namespace}" changed. Old value was "${oldValue}", new value is "${newValue}".`);
    }
}
);
/*
chrome.runtime.onConnect.addListener(() => {
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Port connected');
    log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Tab updated');
});

chrome.runtime.onConnect.addListener(function (port) {
    port.onMessage.addListener(function (msg) {
        log('port message', msg);
    });
});*/

chrome.runtime.onConnect.addListener(function(port) {
    
    console.assert(port.name === "content_script");
    port.onMessage.addListener(function(msg) {
      if (msg.joke === "Knock knock"){
        retrieveAccessToken().then((accessToken) => {
        log('Access token:', accessToken);
    });
        port.postMessage({question: "Who's there?"});}
      else if (msg.answer === "Madame")
        port.postMessage({question: "Madame who?"});
      else if (msg.answer === "Madame... Bovary")
        port.postMessage({question: "I don't get it."});
    });
  });