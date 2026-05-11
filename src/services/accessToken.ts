import { logger } from '@/utils';
import { HttpMethod, makeRequest } from './httpRequest.ts';

const client_id = import.meta.env.WXT_API_CLIENT_ID;
const client_secret = import.meta.env.WXT_API_CLIENT_SECRET;

/**
 * Request a new access token from Google using a refresh token.
 * @param refreshT - Refresh token.
 * @returns A promise that resolves to the OAuth2 response.
 * @throws Error when the OAuth2 client configuration is missing.
 */
const requestAccessToken = (refreshT: string): Promise<Response> => {
    if (!client_id || !client_secret) {
        throw new Error('Invalid oauth2 configuration in requestAccessToken');
    }
    return makeRequest({
        url: 'https://oauth2.googleapis.com/token',
        method: HttpMethod.POST,
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            client_id: client_id,
            client_secret: client_secret,
            refresh_token: refreshT,
            grant_type: 'refresh_token'
        }
    });
};

/**
 * Parse an OAuth2 token response and extract the access token.
 * @param response - OAuth2 token response.
 * @returns A promise that resolves to the access token.
 * @throws Error when the response is not OK or contains an OAuth2 error.
 */
const parseAccessTokenResponse = async (response: Response): Promise<string> => {
    const parsedResponse = await response.json();
    logger.debug('exchangeRefreshForAccessToken parsedResponse: ', parsedResponse);
    if (!response.ok) {
        throw new Error(parsedResponse.error);
    }
    return parsedResponse.access_token;
};

/**
 * Exchange a refresh token for a new access token.
 * @param refreshT - Refresh token.
 * @returns A promise that resolves to the new access token.
 * @throws Error when OAuth2 configuration is invalid or exchange fails.
 * @remarks Logs response details and rethrows a standardized error on parse failure.
 * @see {@link https://www.xiegerts.com/post/chrome-extension-google-oauth-refresh-token/ | Handling Google OAuth Refresh Tokens in a Chrome Extension}
*/
export async function exchangeRefreshForAccessToken(refreshT: string): Promise<string> {
    if (!client_id || !client_secret) {
        throw new Error('Invalid oauth2 configuration');
    }

    if (refreshT === undefined) {
        throw new Error('Error getting refresh token');
    }

    const response = await requestAccessToken(refreshT);
    logger.debug('exchangeRefreshForAccessToken Response: ', response);

    try {
        return await parseAccessTokenResponse(response);
    } catch (error) {
        logger.debug('Error parsing response: ', error);
        throw new Error('Error exchanging refresh token for access token');
    }
}

/**
 * Validate an access token against the token info endpoint.
 * @param token - Access token to validate.
 * @returns A promise that resolves to true when the token is valid, otherwise false.
 * @throws Error when the validation request fails.
 */
export async function isAccessTokenValid(token: string): Promise<boolean> {
    logger.debug('isAccessTokenValid token: ', token);

    if (token === '') {
        logger.debug('Token is empty');
        return false;
    }

    try {
        const response = await fetch('https://oauth2.googleapis.com/tokeninfo?access_token=' + token, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response) {
            const data = await response.json();
            logger.debug('isAccessTokenValid data: ', data);
            return data.aud === client_id;
        }
    } catch (error) {
        logger.debug('Error validating token: ', error);
        throw new Error('Error validating token');
    }

    return false;
}

/**
 * Return a valid access token or exchange the refresh token.
 * @param accessToken - Current access token.
 * @param refreshToken - Refresh token used when the current token is invalid.
 * @returns A promise that resolves to a valid access token.
 * @throws Error when unable to retrieve a valid access token.
 */
export async function getValidAccessToken(accessToken: string, refreshToken: string): Promise<string> {
    logger.debug('Checking access token validity:', accessToken);

    if (!accessToken) {
        logger.debug('No access token found');
    } else if (await isAccessTokenValid(accessToken)) {
        logger.debug('Access token is valid');
        return accessToken;
    } else {
        logger.debug('Access token is invalid, attempting to exchange refresh token: ', refreshToken);
        if (refreshToken === '') {
            logger.debug('Refresh token is invalid');
            throw new Error('No refresh token available to exchange for access token');
        }
        const newAccessToken = await exchangeRefreshForAccessToken(refreshToken);
        if (newAccessToken) {
            logger.debug('New access token obtained:', newAccessToken);
            return newAccessToken;
        } else {
            throw new Error('Unable to retrieve a valid access token');
        }
    }
}