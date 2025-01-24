import log from "../logger";


export async function setAccessTokenCookie(value: string) {
    //log('setting cookie: ', value);
// get current date
    let currentDate = new Date();
    const expirationDate = new Date(currentDate.getTime() + 3600);
    log('currentDate: ', currentDate);
    log('expirationDate: ', expirationDate);

    //document.cookie = `accessToken=${value}; expires=${expirationDate.getTime() + 3600}; domain=archiveofourown.org; path=/`;
    // Set the access token cookie with a 30-second expiration
chrome.cookies.set({ url: 'https://archiveofourown.org', name: 'accessToken', value, expirationDate: expirationDate.getTime() / 1000 })
.then(cookie => console.log('cookie set: ', cookie));
}

export async function getAccessTokenCookie(): Promise<string | undefined> {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
    const accessToken = cookies.find(cookie => cookie[0] === 'accessToken')?.[1];
    log('cookies: ', cookies);
    log('accessToken: ', accessToken);
    return accessToken;
    //return await chrome.cookies.get({ url: 'https://archiveofourown.org', name: 'accessToken' })
    //    .then(cookie => {
    //        log('cookie: ', cookie)
    //        return cookie?.value;
    //    }).catch(err => {
    //        log('cookie error: ', err);
    //        return undefined;
    //    });
}