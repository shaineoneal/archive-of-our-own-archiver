import { useEffect } from 'react';
import { exchangeRefreshForAccessToken, isAccessTokenValid } from '../chrome-services';
import { GoToSheet, Login } from '../components';
import { getActions, useUser, useLoaderStore } from '../utils/zustand/';


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
    const { setAccessToken } = getActions();

    useEffect(() => {
        (async () => {
            if (user.accessToken === undefined) {
                // If the user is not logged in, set the loader to false and return
                setLoader(false);
                return;
            }

            try {
                // Check if the access token is valid
                await isAccessTokenValid(user.accessToken);
            } catch (error) {
                // If there is an error, exchange the refresh token for an access token
                if (user.refreshToken) {
                    const newAccessToken = await exchangeRefreshForAccessToken(user.refreshToken);
                    if (newAccessToken !== user.accessToken) {
                        // If the new access token is different from the current one, update the access token
                        setAccessToken(newAccessToken);
                    }
                } else {
                    // If the user does not have a refresh token, log them out
                    setAccessToken(undefined);
                }
            }
            // Set the loader to false
            setLoader(false);
        })();
    }, [user]);

    return loader ? <div className="loader" /> 
        : user.accessToken === undefined ? <Login /> 
            : <GoToSheet spreadsheetId={user.spreadsheetId} />;
};


export default PopupBody;