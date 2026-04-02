import { exchangeRefreshForAccessToken, isAccessTokenValid } from "@/services/accessToken.ts";


type UserStoreType = {
    accessToken: string;
    refreshToken: string;
    spreadsheetId: string;
}



export class TokenService {
    constructor(private token : UserStoreType) {};

    static async getUser() {
        const resp = await storage.getItems([
            'session:accessToken',
            'local:refreshToken',
            'sync:spreadsheetId'
        ]);
        logger.debug('Checking access token from storage', resp);

        //if user does not have a refresh token, they are not logged in, so we can return early
        if (!resp[1].value) {
            logger.info('No refresh token found, user is not logged in.');
            return null;
        }

        logger.debug('User has refresh token');

        //check for user's access token
        if (resp[0].value) {
            //is it valid?
            isAccessTokenValid(resp[0].value).then(isValid => {
                if (isValid) {
                    logger.debug('Access token is valid');
                } else {
                    logger.debug('Access token is invalid, attempting to exchange refresh token');
                    //exchange refresh token for new access token
                    try {
                        exchangeRefreshForAccessToken(resp[1].value);
                    } catch (error) {
                        //refresh token is invalid, user needs to log in again
                        logger.info('Error exchanging refresh token for access token, user needs to log in again');
                        logger.error(error);
                    }
                }

        }
    }
}