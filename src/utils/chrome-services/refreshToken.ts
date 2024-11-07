import log from "../logger";
import { HttpMethod, makeRequest } from "./httpRequest";

/**
 * Revokes the given access token.
 * 
 * @category chrome-services
 * @param accessToken The access token to revoke.
 * @returns A promise that resolves with no value.
 * @throws {Error} If the request to revoke the token fails.
 * @see {@link https://www.xiegerts.com/post/chrome-extension-google-oauth-refresh-token/}
 */
export async function revokeTokens(accessToken: string): Promise<boolean> {
    log('revokeTokens')

    const response = await makeRequest({
        url: `https://oauth2.googleapis.com/revoke?token=${accessToken}`,
        method: HttpMethod.POST,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    });

    log('response', response);

    if (!response.ok) {
        throw new Error('Failed to revoke refresh token');
    } else {
        return true;
    }
}