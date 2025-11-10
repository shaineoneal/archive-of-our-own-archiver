import { useContext, useEffect, useState } from 'react';
import { fetchNewAccessToken, fetchSpreadsheetUrl, getLocalAccessToken, isAccessTokenValid } from '../chrome-services';
import { GoToSheet, Login } from '../components';
import { LoaderContext, TokenContext } from '../contexts';
import log from '../utils/logger';

export const PopupBody = () => {
    //begin with loader on
    const { loader, setLoader } = useContext(LoaderContext);
    const [ spreadsheetUrl, setSpreadsheetUrl ] = useState<string>('');
    const { authToken, setAuthToken } = useContext(TokenContext);
    

    useEffect(() => {
        log('useEffect');

        getLocalAccessToken().then((token) => {
            isAccessTokenValid(token).then((valid) => {
                log('valid: ', valid);
                if (!valid) {
                    setAuthToken('');
                } else {
                    setAuthToken(valid);
                }
            });
        }).catch(() => {
            fetchNewAccessToken().then((newToken) => {
                if (authToken !== newToken) setAuthToken(newToken);
            });   
        });

        async function getUserInfo() {

            log('authToken: ', authToken);

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

