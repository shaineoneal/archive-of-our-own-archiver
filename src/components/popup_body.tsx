import { GoToSheet, Login } from '../components';
import { useContext, useEffect, useState } from 'react';
import { log } from '../utils';
import { fetchSpreadsheetUrl, getSavedToken } from '../chrome-services';
import { TokenContext, LoaderContext } from '../contexts';

export const PopupBody = () => {
    //begin with loader on
    const { loader, setLoader } = useContext(LoaderContext);
    const [spreadsheetUrl, setSpreadsheetUrl] = useState<string>('');
    const { authToken, setAuthToken } = useContext(TokenContext);

    useEffect(() => {
        log('useEffect');

        async function getUserInfo() {
            getSavedToken().then((token: string) => {
                if (token === '') log('user is not logged in'); //can be removed when fetchToken is fixed
                setAuthToken(token);
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
};

export default PopupBody;
