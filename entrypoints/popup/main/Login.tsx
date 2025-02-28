import { chromeLaunchWebAuthFlow, createSpreadsheet, requestAuthorization, revokeTokens } from '@/utils/browser-services';
import { useActions, useLoaderStore, useUser } from '@/utils/zustand';
import { sendMessage } from '@/utils/browser-services/messaging';


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

                // If the response has a refresh token, store the async login
                // then send a message to the content script to update the login status
                if (refresh_token) {
                    userStoreLogin( access_token, refresh_token );
                    const tabs = await browser.tabs.query({url: '*://archiveofourown.org/*'});
                    if(tabs) {
                        tabs.forEach(tab => {
                            sendMessage('LoggedIn', {refreshToken: refresh_token, accessToken: access_token}, tab.id);
                        });
                    }
                } else {
                    userStoreLogin( access_token, undefined );
                    console.log("No refresh token found, revoking tokens");
                    await revokeTokens(access_token);
                }
                if (!spreadsheetId){
                    setSpreadsheetId(await createSpreadsheet(access_token));
                }
            }
        } catch (error) {
            console.log('Error in handleLogin: ', error);
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