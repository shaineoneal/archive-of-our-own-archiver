import { ReactElement, useContext } from "react";
import { LoaderContext, RefreshTokenContext } from "../../contexts";
import { AuthFlowResponse, chromeLaunchWebAuthFlow, requestAuthorizaton } from "../../chrome-services/oauth";
import log from "../../utils/logger";
import { syncStorageSet } from "../../chrome-services/storage";
import { NoRefreshToken } from "./NoRefreshToken";
import { fetchSpreadsheetUrl } from "../../chrome-services/spreadsheet";

/**
 * The LoginButton component is a button that triggers a login process and updates the loader state
 * while handling the login flow.
 * 
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
export function LoginButton(): ReactElement {

    const { isLoading, setLoader } = useContext(LoaderContext);
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

        chromeLaunchWebAuthFlow().then((authFlowResponse: AuthFlowResponse) => {
            log('Auth flow response:', authFlowResponse);
            if (chrome.runtime.lastError ) {

                if (chrome.runtime.lastError) {
                    log(chrome.runtime.lastError.message);
                }
                
            } else if (authFlowResponse.url && authFlowResponse.code) {
                log('Auth flow response:', authFlowResponse);
                requestAuthorizaton(authFlowResponse).then((authRequestResponse) => {
                    syncStorageSet('access_token', authRequestResponse.access_token);
                    if (authRequestResponse.refresh_token) {
                        setRefreshToken(authRequestResponse.refresh_token);
                        syncStorageSet('refresh_token', authRequestResponse.refresh_token);

                    } else { 
                        setRefreshToken('error');
                        syncStorageSet('refresh_token', 'error');
                    }
                }).then(() => {
                    fetchSpreadsheetUrl().then((spreadsheetUrl) => {
                        syncStorageSet('spreadsheet_url', spreadsheetUrl);
                    });
                });
            }
    }).then(() => {setLoader(false)});

    }

        return (

            <div>
                <button
                    className="login-button"
                    onClick={handleLogin}
                    disabled={isLoading}
                >
                    Login
                </button>
            </div>
        )
    }