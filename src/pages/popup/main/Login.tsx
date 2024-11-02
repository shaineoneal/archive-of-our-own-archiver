import { chromeLaunchWebAuthFlow, requestAuthorizaton } from '../../../utils/chrome-services';
import { revokeTokens, createSpreadsheet } from '../../../utils/chrome-services';
import log from '../../../utils/logger';
import { useActions, useLoaderStore, useUser } from '../../../utils/zustand';


/**
 * Component for the login functionality.
 * Allows users to log in to Google and obtain an access token.
 * The component displays a login button and a loader while the authentication flow is in progress.
 * @component
 * @group Popup
 * @returns the LoginButton component 
 */
export const Login = () => {
    const { loader, setLoader } = useLoaderStore();
    const { userStoreLogin, setSpreadsheetId } = useActions();
    const spreadsheetId = useUser().spreadsheetId;

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
        const flowResp = await chromeLaunchWebAuthFlow(true);

        // If the response has a URL and a code, request authorization
        if (flowResp.url && flowResp.code) {
            await requestAuthorizaton(flowResp).then(
                async ({ access_token, refresh_token }) => {
                    //TODO: if no refresh token, fix it
                    if (refresh_token) {
                        userStoreLogin( access_token, refresh_token );
                    } else {
                        userStoreLogin( access_token, undefined );
                        log("No refresh token found, revoking tokens");
                        revokeTokens(access_token);
                    }
                    if (spreadsheetId === undefined){
                        setSpreadsheetId(await createSpreadsheet(access_token));
                    }
                }
            );
        }

        setLoader(false);
    };

    return (
        <>
            <h1>Please log in to begin</h1>
            <div className="login">
                <button
                    id="login-button"
                    onClick={ handleLogin }
                    disabled={ loader }
                >
                    Login to Google
                </button>
            </div>
        </>
    );
};