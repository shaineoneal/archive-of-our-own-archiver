import { useContext } from 'react';
import { fetchToken } from '../chrome-services/authToken';
import { fetchSpreadsheetUrl } from '../chrome-services/spreadsheet';
import { LoaderContext, TokenContext } from '../contexts';
import { log } from '../utils';
import { launchWebAuthFlow } from '../chrome-services/utils/oauthSignIn';
import { getCookie } from '../chrome-services/utils/cookies';

export const Login = () => {
    const { loader, setLoader } = useContext(LoaderContext);
    const { authToken, setAuthToken } = useContext(TokenContext);

    const handleLogin = async () => {
        setLoader(true);

        const cookie = await launchWebAuthFlow(true);

        setAuthToken(cookie.value);
        //globalThis.AUTH_TOKEN = cookie.value;
        //log('global.AUTH_TOKEN: ', globalThis.AUTH_TOKEN);
        
        const url = await fetchSpreadsheetUrl();

        if (url === null) {
            throw new Error('Error getting spreadsheet url');
        } else {
            chrome.storage.sync.set({ spreadsheetUrl: url });
        }

        //log('loginCookie: ', getCookie('login', 'https://archiveofourown.org'));

        setLoader(false);
    };

    return (
        <>
            <h1>Please log in to begin</h1>
            <div className="popup login">
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
