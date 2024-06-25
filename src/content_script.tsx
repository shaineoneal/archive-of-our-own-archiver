import { retrieveAccessToken } from "./chrome-services";
import log from "./utils/logger";

console.log('Content script loaded!');

const body = document.querySelector('body');

const app = document.createElement('link');

app.id = 'root';
app.setAttribute('rel', 'stylesheet');

if (body) {
    body.prepend(app);
}
/*
connectPort().then((port) => {
    log('port: ', port);
});

//open up connection to background script
async function connectPort(): Promise<chrome.runtime.Port> {
    log('connecting to port');
    const port = await chrome.runtime.connect({ name: 'content_script' });
    log('port: ', port);
    return port;
}
*/
var port = chrome.runtime.connect({name: "content_script"});
port.postMessage({joke: "Knock knock"});
port.onMessage.addListener(function(msg) {
  if (msg.question === "Who's there?"){
    console.log('Madame');
    port.postMessage({answer: "Madame"});}
  else if (msg.question === "Madame who?")
    port.postMessage({answer: "Madame... Bovary"});
});