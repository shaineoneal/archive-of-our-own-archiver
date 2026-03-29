import { deriveChallenge, generateRandomString } from "@/utils";
import { HttpMethod, makeRequest } from "@/services/httpRequest.ts";

interface AuthToken {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    token_type: string;
}

interface OAuthConfig {
    clientId: string;
    redirectUri: string;
    authEndpoint: string;
    tokenEndpoint: string;
    scopes: string[];
}

const CONFIG: OAuthConfig = {
    clientId: import.meta.env.WXT_API_CLIENT_ID,
    redirectUri: import.meta.env.CHROME ? import.meta.env.WXT_API_REDIRECT_URI : "https://shaine.io", // Must be registered with provider
    authEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenEndpoint: "https://oauth2.googleapis.com/token",
    scopes: ["email", "profile", "https://www.googleapis.com/auth/spreadsheets"],
};

/** Initiates the OAuth flow */
export async function startAuthFlow(): Promise<void> {
    const verifier = generateRandomString();
    const challenge = await deriveChallenge(verifier);

    // Store the verifier temporarily for later use during token exchange
    await browser.storage.local.set({ "pending_verifier": verifier });

    const authUrl = new URL(CONFIG.authEndpoint);
    authUrl.searchParams.set("client_id", CONFIG.clientId);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("redirect_uri", CONFIG.redirectUri);
    authUrl.searchParams.set("code_challenge", challenge);
    authUrl.searchParams.set("code_challenge_method", "S256");
    authUrl.searchParams.set("scope", CONFIG.scopes.join(" "));
    authUrl.searchParams.set("access_type", "offline"); // Request refresh token
    authUrl.searchParams.set("prompt", "consent"); // Force consent to ensure refresh token is issued

    // Open the auth page in a new tab
    await browser.tabs.create({ url: authUrl.toString() });

}

/** Exchanges the auth code for access/refresh tokens */
export async function exchangeCodeForToken(code: string, verifier: string): Promise<AuthToken> {
//TODO: Try saving token inside here?
    const response = makeRequest({
        url: CONFIG.tokenEndpoint,
        method: HttpMethod.POST,
        headers: {
            Authorization: `Bearer ${verifier}`,
        },
        body: {
            client_id: CONFIG.clientId,
            client_secret: import.meta.env.WXT_API_CLIENT_SECRET,
            code_verifier: verifier,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: CONFIG.redirectUri,
        }
    }).then(async (response: any) => {
        const responseJson = await response.json();
        logger.debug("responseJson", JSON.stringify(responseJson));
        return responseJson;
    }).catch((error: any) => {
        logger.error(error);
    });



}



interface AccessTokenResponse {
    access_token: string;
    expires_in: number;
    id_token: string;
    refresh_token?: string;
    refresh_token_expires_in?: number;
    scopes: string[];
    token_type: string;
}