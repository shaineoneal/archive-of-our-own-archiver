import { createSpreadsheet } from "..";
import { log } from "../../utils";
import { createCookie } from "./cookies";

const redirectURL = chrome.identity.getRedirectURL();
const { oauth2 } = chrome.runtime.getManifest();

if (!oauth2) {
  throw new Error('You need to specify oauth2 in manifest.json');
}
const clientId = oauth2.client_id;
const authParams = new URLSearchParams({
    //access_type: 'offline',
    client_id: clientId,
    response_type: 'token',
    redirect_uri: redirectURL,
    scope: ['https://www.googleapis.com/auth/spreadsheets'].join(' '),
});
const authURL = `https://accounts.google.com/o/oauth2/auth?${authParams.toString()}`;

export function launchWebAuthFlow (interactive: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
        chrome.identity.launchWebAuthFlow({ url: authURL, interactive }, (async (responseUrl: any) => {
    
            const url = new URL(responseUrl);
            const urlParams = new URLSearchParams(url.hash.slice(1));
            log('urlParams', urlParams);
            const params = Object.fromEntries(urlParams.entries()); // access_token, expires_in
            params.expires_in = '43199';  // 12 hours
            log('params', params);

            const token = params.access_token;

            const cookie = await createCookie({
                name: 'authToken',
                url: 'https://www.archiveofourown.org/',
                value: token,
                expirationDate: Date.now() / 1000 + 43199,  // 12 hours
                domain: '.archiveofourown.org',
            });

            log('cookie', cookie);
            if (cookie) {
                return resolve(cookie);
            }
            else {
                reject();
            }
        }
    ));
}
)}


    //fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`, {
    //    method: 'GET',
    //    headers: { 'Content-Type': 'application/json' },
    //}).then(response => response.json()).then((data) => {
    //    alert(JSON.stringify(data));
    //});
