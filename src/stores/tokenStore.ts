import { storage } from "#imports";


const accessToken = storage.defineItem<string>(
    'session:accessToken'
)

export class TokenStore {
    constructor(private readonly userStore: UserStoreType) {};

    async getAccessToken(): Promise<string> {
        const token = await storage.getItem('session:accessToken');
        if (!token) {
            logger.error(`Could not get access token: ${token}`);
        }
        return token as string;
    }

    static login(accessToken: string, refreshToken: string, spreadsheetId: string): Promise<void> {
        // Implement login logic here, e.g., make an API call to authenticate and retrieve tokens
        // Then update the userStore with the new tokens and their expiry times

        logger.debug('TokenStore login');
        storage.setItems([
            { key: 'session:accessToken', value: accessToken },
            { key: 'local:refreshToken', value: refreshToken },
            { key: 'sync:spreadsheetId', value: spreadsheetId }
        ]).then(r => logger.debug('Tokens stored successfully', r)).catch(e => logger.error('Error storing tokens', e));

    }
    async logout(): Promise<void> {

    }

}