export async function setAccessTokenCookie(value: string) {
    //console.log('setting cookie: ', value);
// get current date
    let currentDate = new Date();
    const expirationDate = new Date(currentDate.getTime() + 3600000);
    console.log('currentDate: ', currentDate);
    console.log('expirationDate: ', expirationDate);

    //document.cookie = `accessToken=${value}; expires=${expirationDate.getTime() + 3600}; domain=archiveofourown.org; path=/`;
    // Set the access token cookie with a 30-second expiration
browser.cookies.set({ url: 'https://archiveofourown.org', name: 'accessToken', value, expirationDate: expirationDate.getTime() })
.then(cookie => console.log('cookie set: ', cookie));
}

export async function getAccessTokenCookie(): Promise<string | undefined> {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
    console.log('cookies found: ', cookies);
    return cookies.find(cookie => cookie[0] === 'accessToken')?.[1];
}