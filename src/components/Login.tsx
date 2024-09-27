import { useContext } from 'react';
import { fetchSpreadsheetUrl } from '../chrome-services/spreadsheet';
import { chromeLaunchWebAuthFlow, AuthFlowResponse, requestAuthorizaton } from '../chrome-services/utils/oauthSignIn';
import { LoaderContext, TokenContext } from '../contexts';
import log from '../utils/logger';
import { setStore, StoreMethod } from '../chrome-services';


/**
 * Component for the login functionality.
 * Allows users to log in to Google and obtain an access token.
 * The component displays a login button and a loader while the authentication flow is in progress.
 * @category Component
 * @group Popup
 * @returns the LoginButton component 
 */
export const Login = () => {
    const { loader, setLoader } = useContext(LoaderContext);
    const { setAuthToken } = useContext(TokenContext);

    // TODO: set up full userstore on login

    /**
     * Handles the login functionality.
     * Launches the web authentication flow with interactive set to true.
     * Requests authorization and sets the access token in the local storage and user store.
     * Set the spreadsheet URL in the sync storage.
     */
    const handleLogin = async () => {

        setLoader(true);    //show loader

        // Launch the web authentication flow with interactive set to true
        chromeLaunchWebAuthFlow(true).then((flowResp: AuthFlowResponse) => {
            log('Auth Flow Response: ', flowResp);

            // If the response has a URL and a code, request authorization
            if (flowResp.url && flowResp.code) {
                requestAuthorizaton(flowResp).then((requestResp) => {
                    log('requestResp: ', requestResp);

                    // Set the access token in the local storage
                    setStore('accessToken', requestResp.access_token, StoreMethod.LOCAL);

                    // Set the access token in the user store
                    setAuthToken(requestResp.access_token);

                    // If the response has a refresh token, set it in the local storage
                    if (requestResp.refresh_token) {
                        setStore('refresh_token', requestResp.refresh_token, StoreMethod.SYNC);
                    }
                });
            }
        }).then(() => {
            // Fetch the spreadsheet URL
            fetchSpreadsheetUrl().then((url) => {
                chrome.storage.sync.set({ spreadsheetUrl: url });
                
            });
        }).then(() => { 
            setLoader(false);       //hide loader
        });
    };

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