import { GoToSheet, Login } from '../components';
import { useContext, useEffect, useState } from 'react';
import { log } from '../utils';
import { fetchSheetUrl, fetchToken } from '../chrome-services';
import { TokenContext, LoaderContext } from '../contexts';

export const PopupBody = () => {
    //begin with loader on
    const { loader, setLoader } = useContext(LoaderContext);
    const [sheetUrl, setSheetUrl] = useState<string>('');
    const { authToken, setAuthToken } = useContext(TokenContext);

    useEffect(() => {
        log('useEffect');

        async function getUserInfo() {
            fetchToken(false).then((token) => {
                if (token === '') log('user is not logged in'); //can be removed when fetchToken is fixed
                setAuthToken(token);
            });

            fetchSheetUrl().then((url) => {
                log('url: ', url);
                setSheetUrl(url);
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
                    {!authToken ? (<Login />) : (<GoToSheet sheetUrl={sheetUrl} />)}
                </div>
                
            </>
        );
    }
};

export default PopupBody;
