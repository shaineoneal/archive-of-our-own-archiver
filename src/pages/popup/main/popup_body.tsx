import { useEffect } from 'react';
import { exchangeRefreshForAccessToken, isAccessTokenValid } from '../../../utils/chrome-services';
import { GoToSheet, Login } from './';
import log from '../../../utils/logger';
import { useActions, useLoaderStore, useUser } from '../../../utils/zustand';


/**
 * The popup body component.
 * This component will display either a login or the GoToSheet component based on the user's login status.
 * If the user is not logged in, it will display a login button.
 * If the user is logged in, it will display the GoToSheet component.
 * If the user's access token is invalid, it will exchange the refresh token for an access token.
 * If the user does not have a refresh token, it will log the user out.
 * @category Component
 * @group Popup
 * @returns the PopupBody component
 */
export const PopupBody = () => {
    const { loader, setLoader } = useLoaderStore();
    const user = useUser();
    const { setAccessToken, setIsLoggedIn } = useActions();

    useEffect(() => {
        (async () => {
            if (user.refreshToken && !user.accessToken) {
                log('User has a refresh token but no access token');

                // If the user just has a refresh token (for some reason), exchange it for an access token
                const newAccessToken = await exchangeRefreshForAccessToken(user.refreshToken);
                if (newAccessToken === undefined) {
                    // If the new access token is undefined, log them out
                    setAccessToken(undefined);
                    setIsLoggedIn(false);
                }
                // If the new access token is different from the current one, update the access token
                setAccessToken(newAccessToken);

                setLoader(false);
                return;

            } else if (user.accessToken === undefined || user.spreadsheetId === undefined || user.refreshToken === undefined) {
                // If the user is not logged in, set the loader to false and return
                setLoader(false);
                return;
            }
            // Check if the access token is valid
            const isValid = await isAccessTokenValid(user.accessToken);
            log('Access token is valid:', isValid);
            if (!isValid) {
                log('Access token is invalid');
               // If there is an error, exchange the refresh token for an access token
                if (user.refreshToken) {
                    const newAccessToken = await exchangeRefreshForAccessToken(user.refreshToken);
                    if (newAccessToken === undefined) {
                        // If the new access token is undefined, log them out
                        setAccessToken(undefined);
                        setIsLoggedIn(false);
                    }
                    if (newAccessToken !== user.accessToken) {
                        // If the new access token is different from the current one, update the access token
                        setAccessToken(newAccessToken);
                    }
                } else {
                    log('User does not have a refresh token');
                    // If the user does not have a refresh token, log them out
                    setAccessToken(undefined);
                }
            }
            // Set the loader to false
            setLoader(false);
        })();
    }, [user]);

    return loader ? <div className="loader" /> 
        : ( user.accessToken === undefined || user.spreadsheetId === undefined || user.refreshToken === undefined ) ? <Login /> 
            : <GoToSheet spreadsheetId={user.spreadsheetId as string} />;
};

export default PopupBody;