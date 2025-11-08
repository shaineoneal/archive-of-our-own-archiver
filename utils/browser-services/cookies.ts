// utils/browser-services/cookies.ts

const COOKIE_DOMAIN = 'archiveofourown.org';
const COOKIE_URL = 'https://archiveofourown.org';
const EXPIRATION_MS = 3600000; // 1 hour

export async function setAccessTokenCookie(value: string) {
    log('setAccessTokenCookie called with value:', value);
    const expirationDate = new Date(Date.now() + EXPIRATION_MS);
    await browser.cookies.set({
        url: COOKIE_URL,
        name: 'accessToken',
        value,
        expirationDate: expirationDate.getTime()
    });
}

export async function setRefreshTokenCookie(value: string) {
    const expirationDate = new Date(Date.now() + EXPIRATION_MS);
    await browser.cookies.set({
        url: COOKIE_URL,
        name: 'refreshToken',
        value,
        expirationDate: expirationDate.getTime()
    });
}

export async function getAccessTokenCookie(): Promise<string | undefined> {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
    return cookies.find(cookie => cookie[0] === 'accessToken')?.[1];
}

export async function getRefreshTokenCookie(): Promise<string | undefined> {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
    return cookies.find(cookie => cookie[0] === 'refreshToken')?.[1];
}

export async function removeAccessTokenCookie() {
    await browser.cookies.remove({ url: COOKIE_URL, name: 'accessToken' });
}

export async function removeRefreshTokenCookie() {
    await browser.cookies.remove({ url: COOKIE_URL, name: 'refreshToken' });
}

// Zustand-compatible cookie storage
export const cookieStorage = {
    async getItem(name: string) {
        const accessToken = await getAccessTokenCookie() || '';
        const refreshToken = await getRefreshTokenCookie() || '';
        return {
            state: { accessToken, refreshToken }
        };
    },
    async setItem(name: string, value: any) {
        await setAccessTokenCookie(value.state.accessToken || '');
        await setRefreshTokenCookie(value.state.refreshToken || '');
    },
    async removeItem(name: string) {
        await removeAccessTokenCookie();
        await removeRefreshTokenCookie();
    }
};
