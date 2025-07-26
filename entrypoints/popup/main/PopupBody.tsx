import { useEffect } from 'react';
import { exchangeRefreshForAccessToken, isAccessTokenValid } from '@/utils/browser-services';
import { log } from '@/utils';
import { SyncUserStore, useActions, useLoaderStore, useUser } from '@/utils/zustand';
import { GoToSheetButton, LoginButton } from './';

/**
 * The popup body component.
 * Displays login or GoToSheet based on user's login status.
 */
export const PopupBody = () => {
    const { setLoader } = useLoaderStore();
    const user = useUser();
    const setUser = SyncUserStore.getState().actions.userStoreLogin;
    const { setAccessToken, logout } = useActions();

    useEffect(() => {
        (async () => {
            setLoader(true);
            // Get latest user info from store
            const newUser = await SyncUserStore.getState().actions.getUser();
            setUser(newUser.accessToken!, newUser.refreshToken!, newUser.spreadsheetId!);

            // If missing any required token/id, stop loading and return
            if (!newUser.refreshToken || !newUser.spreadsheetId) {
                setLoader(false);
                return;
            }

            // If missing access token but have refresh token, try to refresh
            if (!newUser.accessToken) {
                try {
                    const newAccessToken = await exchangeRefreshForAccessToken(newUser.refreshToken);
                    if (!newAccessToken) {
                        logout();
                        return;
                    }
                    setAccessToken(newAccessToken);
                } catch (e) {
                    log('Error exchanging refresh token for access token', e);
                    logout();
                    return;
                } finally {
                    setLoader(false);
                }
                return;
            }

            // Validate access token
            const valid = await isAccessTokenValid(newUser.accessToken);
            if (!valid) {
                if (newUser.refreshToken) {
                    try {
                        const newAccessToken = await exchangeRefreshForAccessToken(newUser.refreshToken);
                        if (!newAccessToken) {
                            logout();
                            return;
                        }
                        setAccessToken(newAccessToken);
                    } catch (e) {
                        log('Error exchanging refresh token for access token', e);
                        logout();
                        return;
                    }
                } else {
                    logout();
                    return;
                }
            } else {
                log('Access token is valid');
            }
            setLoader(false);
        })();
    }, [setLoader, setUser, setAccessToken, logout]);

    // Show Login if any required field is missing, otherwise GoToSheet
    return (!user.accessToken || !user.spreadsheetId || !user.refreshToken)
        ? <LoginButton/>
        : <GoToSheetButton spreadsheetId={user.spreadsheetId as string}/>;
};