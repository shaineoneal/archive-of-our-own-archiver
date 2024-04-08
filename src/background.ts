//import { google } from 'googleapis';

import log from "./utils/logger"

chrome.storage.onChanged.addListener((changes, namespace) => {
    for(const [key, { oldValue, newValue }] of Object.entries(changes)) {
        log(`Storage key "${key}" in namespace "${namespace}" changed. Old value was "${oldValue}", new value is "${newValue}".`);
    }
}
);

