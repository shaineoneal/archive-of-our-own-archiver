import { useContext } from 'react';
import { fetchToken } from '../chrome-services/authToken';
import { fetchSpreadsheetUrl } from '../chrome-services/spreadsheet';
import { LoaderContext, TokenContext } from '../contexts';
import { log } from '../utils';

export const Login = () => {
    const { loader, setLoader } = useContext(LoaderContext);
    const { setAuthToken } = useContext(TokenContext);

    const handleLogin = async () => {
        setLoader(true);

        const token = await fetchToken(true);
        if (token === null) {
            throw new Error('Error getting token');
        } else {
            log('token: ', token);
            chrome.storage.sync.set({ authToken: token });
            setAuthToken(token);
        }

        const url = await fetchSpreadsheetUrl();
        if (url === null) {
            throw new Error('Error getting spreadsheet url');
        } else {
            chrome.storage.sync.set({ spreadsheetUrl: url });
        }

        setLoader(false);
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
