import { useContext } from 'react';
import { fetchSpreadsheetUrl } from '../chrome-services/spreadsheet';
import { chromeLaunchWebAuthFlow, AuthFlowResponse, requestAuthorizaton } from '../chrome-services/utils/oauthSignIn';
import { LoaderContext, TokenContext } from '../contexts';
import log from '../utils/logger';
import { setStore, StoreMethod } from '../chrome-services';

/**
 * Component for the login functionality.
 * Allows users to log in to Google and obtain an access token.
 * @category Component
 * @group Popup
 * @returns the LoginButton component 
 * ```tsx
 * <div>
 *      <button>
 *          Login
 *      </button>
 * </div>
 * ```
 */
export const Login = () => {
    const { loader, setLoader } = useContext(LoaderContext);
    const { setAuthToken } = useContext(TokenContext);

    /**
     * Handles the login process.
     * Sets the loader to true, launches the web authentication flow,
     * requests authorization, sets the access token and refresh token (if available),
     * fetches the spreadsheet URL, and sets the loader to false.
     */
    const handleLogin = async () => {
        setLoader(true);

        chromeLaunchWebAuthFlow().then((flowResp: AuthFlowResponse) => {
            log('Auth Flow Response: ', flowResp);
            if (flowResp.url && flowResp.code) {
                requestAuthorizaton(flowResp).then((requestResp) => {
                    log('requestResp: ', requestResp);
                    setStore('accessToken', requestResp.access_token, StoreMethod.LOCAL);
                    setAuthToken(requestResp.access_token);

                    if (requestResp.refresh_token) {
                        setStore('refresh_token', requestResp.refresh_token, StoreMethod.LOCAL);
                    }
                });
            }
        }).then(() => {
            fetchSpreadsheetUrl().then((url) => {
                chrome.storage.sync.set({ spreadsheetUrl: url });
            });
        }).then(() => { setLoader(false); });
    }

    return (
        <>
            <h1>Please log in to begin</h1>
            <div className="login">
                <button
                    id="login-button"
                    onClick={() => handleLogin()}
                    disabled={loader}
                >
                    Login to Google
                </button>
            </div>
        </>
    );
};
