import { defineWebExtConfig } from "wxt";
import { resolve } from 'node:path';

export default defineWebExtConfig({
    openDevtools: true,
    chromiumProfile: import.meta.env.WXT_API_PROFILE_ADDRESS ? resolve(import.meta.env.WXT_API_PROFILE_ADDRESS) : undefined,
    keepProfileChanges: true,
    openConsole: true,
    startUrls: [ 'chrome://extensions', 'https://archiveofourown.org/works/'],
});