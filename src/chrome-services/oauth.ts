


function createAuthUrl() {

    const { oauth2 } = chrome.runtime.getManifest();
    const redirectUri = chrome.identity.getRedirectURL();

    if (!oauth2 || !oauth2.client_id || !oauth2.scopes) {
        throw new Error('Invalid oauth2 configuration');
    }

    var authParams = new URLSearchParams({
        client_id: oauth2.client_id,
        redirect_uri: redirectUri,
        response_type: 'token',
        scope: oauth2.scopes.join(' '),
    });

    return `https://accounts.google.com/o/oauth2/auth?${authParams.toString()}`;
}