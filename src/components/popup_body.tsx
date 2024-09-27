import { useContext, useEffect, useState } from 'react';
import { exchangeRefreshForAccessToken, fetchSpreadsheetUrl, getLocalAccessToken, getValidAccessToken, isAccessTokenValid, setStore, StoreMethod } from '../chrome-services';
import { GoToSheet, Login } from '../components';
import { LoaderContext, TokenContext } from '../contexts';
import log from '../utils/logger';
import { getRefreshToken, getValidRefreshToken } from '../chrome-services/refreshToken';

export const PopupBody = () => {
    //begin with loader on
    const { loader, setLoader } = useContext(LoaderContext);
    const [ spreadsheetUrl, setSpreadsheetUrl ] = useState<string>('');
    
    const { authToken, setAuthToken } = useContext(TokenContext);


    useEffect(() => {
        const fetchTokens = async () => {
            // if both access and refresh token exist, use them
            try {
                const accessT = await getValidAccessToken();
                const refreshT = await getValidRefreshToken();

                if (accessT && refreshT) {
                    setAuthToken(accessT);
                }
            } catch (error) {
                // if only refresh token exists, exchange it for an access token
                try {
                    const refreshT = await getValidRefreshToken();
                    log("refreshT: ", refreshT);
                    const response = await exchangeRefreshForAccessToken(refreshT);
                    log("exchangeRefreshTokenForAccessToken response: ", response);
                    if (authToken !== response) {
                        setAuthToken(response);
                        await setStore('accessToken', response, StoreMethod.LOCAL);
                    }
                } catch (error) {
                    log("No refresh token found.", error)
                }
            } finally {
                setLoader(false);
            }
        };

        fetchTokens();
    }, []);

    if (loader) {
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
