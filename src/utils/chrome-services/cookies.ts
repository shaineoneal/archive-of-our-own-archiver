import log from "../logger";


export async function setAccessTokenCookie(value: string) {
    //log('setting cookie: ', value);
    const expirationDate = new Date();
    //document.cookie = `accessToken=${value}; expires=${expirationDate.getTime() / 1000 + 3600}; domain=archiveofourown.org; path=/`;
    chrome.cookies.set({ url: 'https://archiveofourown.org', name: 'accessToken', value, expirationDate: (expirationDate.getTime() / 1000) + 3600 })
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