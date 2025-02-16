// @ts-ignore
import { handleVisibilityChange, main as contentScriptMain, messageListener } from "./content_script";

export * from "./Ao3_BaseWork.ts"
export * from "./BaseWork.ts";
export * from "./User_BaseWork.tsx";

export default defineContentScript({
    matches: ["*://*.archiveofourown.org/*"],
    runAt: "document_end",
    async main() {
        console.log('content script running');
        browser.runtime.onMessage.addListener(messageListener);
        document.addEventListener('visibilitychange', handleVisibilityChange);
    },
});