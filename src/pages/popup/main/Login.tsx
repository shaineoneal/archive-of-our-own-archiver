import { chromeLaunchWebAuthFlow, requestAuthorization, revokeTokens, createSpreadsheet } from '../../../utils/chrome-services';
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

    // TODO: set up full user store on login

    /**
     * Handles the login functionality.
     * Launches the web authentication flow with interactive set to true.
     * Requests authorization and sets the access token in the local storage and user store.
     * Set the spreadsheet URL in the sync storage.
     */
    const handleLogin = async () => {
        setLoader(true);    //show loader

        try {

            // Launch the web authentication flow with interactive set to true
            const flowResp = await chromeLaunchWebAuthFlow(true);

            // If the response has a URL and a code, request authorization
            if (flowResp.url && flowResp.code) {
                const { access_token, refresh_token } = await requestAuthorization(flowResp);
            
                //TODO: if no refresh token, fix it
                if (refresh_token) {
                    userStoreLogin( access_token, refresh_token );
                } else {
                    userStoreLogin( access_token, undefined );
                    log("No refresh token found, revoking tokens");
                    await revokeTokens(access_token);
                }
                if (!spreadsheetId){
                    setSpreadsheetId(await createSpreadsheet(access_token));
                }
            }
        } catch (error) {
            log('Error in handleLogin: ', error);
        } finally {
            setLoader(false);   //hide loader
        }
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