import { useEffect } from 'react';
import { exchangeRefreshForAccessToken, isAccessTokenValid } from '@/utils/browser-services';
import { log } from '@/utils';
import { SyncUserStore, useActions, useLoaderStore, useUser } from '@/utils/zustand';
import { GoToSheet, Login } from './';


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
    let user = useUser();
    const setUser = SyncUserStore.getState().actions.userStoreLogin;
    const { setAccessToken, logout } = useActions();

    useEffect(() => {
        (async () => {
            const newUser = await SyncUserStore.getState().actions.getUser()
            console.log(newUser);
            setUser(newUser.accessToken!, newUser.refreshToken!, newUser.spreadsheetId!);
            user = newUser;

            if (user.refreshToken && !user.accessToken) {
                console.log('User has a refresh token but no access token');

                try {
                    // If the user has a refresh token but no access token, exchange the refresh token for an access token
                    const newAccessToken = await exchangeRefreshForAccessToken(user.refreshToken);
                    if (!newAccessToken) {
                        logout();
                        return;
                    }
                    setAccessToken(newAccessToken);
                } catch (e) {
                    console.log('Error exchanging refresh token for access token', e);
                    logout();
                    return;
                } finally {
                    setLoader(false);
                }

            } else if (user.accessToken === '' || user.spreadsheetId === '' || user.refreshToken === '') {
                // If the user is not logged in, set the loader to false and return
                setLoader(false);
                return;
            }
            // Check if the access token is valid
            const validity = await isAccessTokenValid(user.accessToken!);
            console.log('User access token', validity);
            if (user.accessToken && !await isAccessTokenValid(user.accessToken)) {
                console.log('Access token is invalid');
                if (user.refreshToken) {
                    try {
                        // If the access token is invalid, exchange the refresh token for a new access token
                        const newAccessToken = await exchangeRefreshForAccessToken(user.refreshToken);
                        if (!newAccessToken) {
                            logout();
                            return;
                        }
                        setAccessToken(newAccessToken);
                    } catch (e) {
                        console.log('Error exchanging refresh token for access token', e);
                        logout();
                        return;
                    }

                } else {
                    logout();
                    return;
                }
            } else log ('Access token is valid');
            setLoader(false);
        })();
    }, []);

    return loader ? <div className="loader" /> 
        : ( user.accessToken === '' || user.spreadsheetId === '' || user.refreshToken === '' ) ? <Login />
            : <GoToSheet spreadsheetId={user.spreadsheetId as string} />;
};

export default PopupBody;