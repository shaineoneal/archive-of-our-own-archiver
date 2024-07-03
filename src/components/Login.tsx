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

        chromeLaunchWebAuthFlow().then((authFlowResponse: AuthFlowResponse) => {
            log('authFlowResponse: ', authFlowResponse);
            if (authFlowResponse.url && authFlowResponse.code) {
                requestAuthorizaton(authFlowResponse).then((authRequestResponse) => {
                    log('authRequestResponse: ', authRequestResponse);
                    setStore({ key: 'accessToken', newValue: authRequestResponse.access_token }, StoreMethod.LOCAL);
                    setAuthToken(authRequestResponse.access_token);

                    if (authRequestResponse.refresh_token) {
                        chrome.storage.sync.set({ refresh_token: authRequestResponse.refresh_token });
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
