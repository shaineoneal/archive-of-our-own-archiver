import { BaseWork } from "../works/BaseWork";
import { log } from "../utils";
import { looksRead } from "../components/looksRead";


export const insideWork = (port: chrome.runtime.Port) => {

    const workId = location.href.split('/')[4] as unknown as number;
    log('insideWork workId: ', workId);

    port.postMessage({ message: 'querySheet', work: workId });

    port.onMessage.addListener((msg) => {
        log('insideWork', 'port.onMessage: ', msg);

        if (msg.reason === 'workQuerySheet') {
            if (msg.response) {
                log('workRef: ', msg.response)
                if (msg.response.table.rows.length > 0) {
                    looksRead(true);
                }
            }
        }
    });
}