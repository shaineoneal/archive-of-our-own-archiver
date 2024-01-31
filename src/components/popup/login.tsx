import { ReactElement, useContext } from "react";
import { LoaderContext, RefreshTokenContext } from "../../contexts";
import { chromeLaunchWebAuthFlow, requestToken } from "../../chrome-services/oauth";
import log from "../../utils/logger";
import { syncStorageSet } from "../../chrome-services/storage";
import { NoRefreshToken } from "./NoRefreshToken";

/**
 * The LoginButton component is a button that triggers a login process and updates the loader state
 * while handling the login flow.
 * 
 * @category Component
 * @group Popup
 * @returns the LoginButton component 
 * ```tsx
 * <div>
 *      <button
 *          className="login-button"
 *          onClick={handleLogin}
 *          disabled={loader}
 *      >
 *          Login
 *      </button>
 * </div>
 */
export function LoginButton(): ReactElement {

    const { loader, setLoader } = useContext(LoaderContext);
    const { refreshToken, setRefreshToken } = useContext(RefreshTokenContext);

    /**
     * Handler for the login button click event.
     * Starts OAuth flow, updates the loader state, and handles the response.
     * 
     * @notExported
     */
    
    const handleLogin = async () => {
        console.log('Login button clicked');

        setLoader(true);

        chromeLaunchWebAuthFlow().then((authResponse) => {
            if (chrome.runtime.lastError ) {

                if (chrome.runtime.lastError) {
                    log(chrome.runtime.lastError.message);
                }
                setLoader(false);
            } else if (authResponse.url && authResponse.code) {
                requestToken(authResponse).then((tokenResponse) => {
                    syncStorageSet('access_token', tokenResponse.access_token);
                    if (tokenResponse.refresh_token) {
                        setRefreshToken(tokenResponse.refresh_token);
                        syncStorageSet('refresh_token', tokenResponse.refresh_token);
                    } else { 
                        setRefreshToken('error');
                        syncStorageSet('refresh_token', 'error');
                    }
                    setLoader(false);
                });
            }
    });

    }
    if (refreshToken === 'error') {
        return (
            <div className="not-logged-in">
                <NoRefreshToken />
            </div>
        );
    }
    else{
    return (
        
        <div>
            <button
                className="login-button"
                onClick={handleLogin}
                disabled={loader}
            >
                Login
            </button>
        </div>
    )}
}