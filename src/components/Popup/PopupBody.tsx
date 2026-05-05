import { useEffect } from 'react';
import { exchangeRefreshForAccessToken, isAccessTokenValid } from '@/services/accessToken';
import { logger } from '@/utils';
import { useActions, useLoaderStore, UserStore, useUser } from '@/stores';
import { GoToSheetButton } from './GoToSheetButton';
import { LoginButton } from './LoginButton';

/**
 * Popup body component that:
 * - Loads the current user state.
 * - Ensures access tokens are present and valid (refreshing if needed).
 * - Shows a loader while auth state is resolved.
 * - Shows login or navigation CTA based on auth state.
 *
 * @remarks
 * Render states:
 * - Loader while auth state is resolving.
 * - Login button if any required auth field is missing.
 * - Go-to-sheet button if user is authenticated.
 */
export const PopupBody = () => {
    const { loader, setLoader } = useLoaderStore();
    let user = useUser();
    const setUser = UserStore.getState().actions.userStoreLogin;
    const { setAccessToken, logout } = useActions();

    useEffect(() => {
        (async () => {
            // Hydrate user from storage and sync into the store.
            const newUser = await UserStore.getState().actions.getUser()
            logger.info('popupbody', { newUser });
            setUser(newUser.accessToken!, newUser.refreshToken!, newUser.spreadsheetId!);
            user = newUser;

            // If we have a refresh token but no access token, try to exchange.
            if (user.refreshToken && !user.accessToken) {
                logger.debug('User has a refresh token but no access token');

                try {
                    // Exchange refresh token for access token.
                    const newAccessToken = await exchangeRefreshForAccessToken(user.refreshToken);
                    if (!newAccessToken) {
                        logout();
                        return;
                    }
                    setAccessToken(newAccessToken);
                } catch (e) {
                    logger.debug('Error exchanging refresh token for access token', e);
                    logout();
                    return;
                } finally {
                    setLoader(false);
                }

            } else if (user.accessToken === '' || user.spreadsheetId === '' || user.refreshToken === '') {
                // If the user is not logged in, stop loading.
                setLoader(false);
                return;
            }

            // Validate existing access token and refresh if needed.
            const validity = await isAccessTokenValid(user.accessToken!);
            logger.debug('User access token', validity);
            if (user.accessToken && !await isAccessTokenValid(user.accessToken)) {
                logger.debug('Access token is invalid');
                if (user.refreshToken) {
                    try {
                        // If the access token is invalid, exchange the refresh token for a new access token.
                        const newAccessToken = await exchangeRefreshForAccessToken(user.refreshToken);
                        logger.debug('Access token is invalid', newAccessToken);
                        if (!newAccessToken) {
                            logout();
                            return;
                        }
                        setAccessToken(newAccessToken);
                    } catch (e) {
                        logger.error('Error exchanging refresh token for access token', e);
                        logout();
                        return;
                    }

                } else {
                    logout();
                    return;
                }
            } else logger.info('Access token is valid');
            setLoader(false);
        })();
    }, []);

    /**
     * Render states:
     * - Loader while auth state is resolving.
     * - Login button if any required auth field is missing.
     * - Go-to-sheet button if user is authenticated.
     */
    return loader ? <div className="loader" />
        : ( user.accessToken === '' || user.spreadsheetId === '' || user.refreshToken === '' ) ? <LoginButton />
            : <GoToSheetButton spreadsheetId={user.spreadsheetId as string} />;
};