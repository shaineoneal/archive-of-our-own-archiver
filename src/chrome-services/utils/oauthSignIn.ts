import { createSpreadsheet } from "..";
import { log } from "../../utils";
import { createCookie } from "./cookies";
import { postRequest } from "..";
import { post } from "jquery";

const clientSecret = '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';

const redirectURL = chrome.identity.getRedirectURL();
const { oauth2 } = chrome.runtime.getManifest();

if (!oauth2) {
  throw new Error('You need to specify oauth2 in manifest.json');
}
const clientId = oauth2.client_id;
var authParams = new URLSearchParams({
    access_type: 'offline',
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectURL,
    scope: ['https://www.googleapis.com/auth/spreadsheets'].join(' '),
});

var authURL = `https://accounts.google.com/o/oauth2/auth?${authParams.toString()}`;


//FIX: interactive can't be false
export function launchWebAuthFlow (interactive: boolean): Promise<any> {
    // https://fpolkflkolbgaceliloehfofnoiklngb.chromiumapp.org/?code=4%2F0AfJohXlKVn_2H24Ht__KzT_cf9kU3oMFEhbeQatKhwA_7v_LOAmcdPWZVbQEtTKWIO0Dgg&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fspreadsheets

    const UnixDate = new Date().getTime() / 1000; //Current time in seconds since 1 Jan 1970

    log('launchWebAuthFlow authParams', Object.fromEntries(authParams.entries()));

    return new Promise((resolve, reject) => {
        chrome.identity.launchWebAuthFlow({ url: authURL, interactive }, (async (responseUrl: any) => {
    
            log('responseUrl', responseUrl);
            const url = new URL(responseUrl);
            log('url', url);
            const urlParams = new URLSearchParams(url.search);
            log('urlParams', urlParams);
            const params = Object.fromEntries(urlParams.entries()); // access_token, expires_in
            const token = params.access_token;

            postRequest('https://oauth2.googleapis.com/token', {
                code: urlParams.get('code'),
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectURL,
                grant_type: 'authorization_code',
            }, token).then((data) => {
                log('postRequest data', data);
            });

            const cookie = await createCookie({
                name: 'authToken',
                url: 'https://www.archiveofourown.org/',
                value: token,
                expirationDate: UnixDate + (43199),  // 12 hours
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

async function refreshToken (refreshToken: string) {
    const response = await fetch('https://www.googleapis.com/oauth2/v4/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            client_id: clientId,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
        }),
    });
    const data = await response.json();
    log('refreshToken data', data);
    return data;
}
