import { defineWebExtConfig } from "wxt";
import { resolve } from 'node:path';

export default defineWebExtConfig({
    openDevtools: true,
    chromiumProfile: resolve('.wxt/chrome-data'),
    keepProfileChanges: true,
    openConsole: true,
    startUrls: [ 'chrome://extensions', 'https://archiveofourown.org/works/'],
});