import { GoToSheet, Login } from '../components';
import { useContext, useEffect, useState } from 'react';
import { log } from '../utils';
import { fetchSpreadsheetUrl, getAccessToken } from '../chrome-services';
import { TokenContext, LoaderContext } from '../contexts';
import { AuthLogin } from './testingButton';
import { getCookie } from '../chrome-services/utils/cookies';
import { launchWebAuthFlow } from '../chrome-services/utils/oauthSignIn';

export const PopupBody = () => {
    //begin with loader on
    const { loader, setLoader } = useContext(LoaderContext);
    const [spreadsheetUrl, setSpreadsheetUrl] = useState<string>('');
    const { authToken, setAuthToken } = useContext(TokenContext);
    

    useEffect(() => {
        log('useEffect');

        

        async function getUserInfo() {
            //const token = refreshToken(token);

            log('authToken: ', authToken);
            
            getAccessToken().then((token: string) => {
                if (token === '') log('user is not logged in'); //can be removed when fetchToken is fixed
                //try to ask for a new token
                else {
                    setAuthToken(token);
                    log('user is logged in');
                }
            });

            fetchSpreadsheetUrl().then((url) => {
                log('url: ', url);
                setSpreadsheetUrl(url);
            });
        }

        getUserInfo().then(() => {
            setLoader(false);
        });
    }, [authToken]);

    if (loader) {
        log('loader is true');
        return <div className="loader"></div>;
    } else {
        return (
            <>
                
                <div>
                    {!authToken ? (<Login />) : (<GoToSheet spreadsheetUrl={spreadsheetUrl} />)}
                </div>
                
            </>
        );
    }
};88

export default PopupBody;
function refreshToken() {
    throw new Error('Function not implemented.');
}

