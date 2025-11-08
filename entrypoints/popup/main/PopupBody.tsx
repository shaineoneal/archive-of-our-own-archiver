import { useEffect } from 'react';
import { exchangeRefreshForAccessToken, getValidAccessToken, isAccessTokenValid } from '@/utils/browser-services';
import { log } from '@/utils';
import { useActions, useLoaderStore, useUser } from '@/utils/zustand';
import { GoToSheetButton, LoginButton } from './';
import { sendMessage } from '@/utils/browser-services/messaging';

/**
 * The popup body component.
 * Displays login or GoToSheet based on user's login status.
 * @startuml
 * :Component mounts;
 * if(accessToken found) then (<color:red>no)
 *     if(refreshToken found) then (<color:red>no)
 *         label sp1
 *         label sp2
 *         label sp3
 *         label sp4
 *         label sp5
 *         label sp6
 *         label sp7
 *         label notIn
 *         :user is not logged in;
 *         stop
 *     else (<color:green>yes)
 *         label spacer
 *         label newAccessToken
 *         :get new accessToken;
 *         if (Exchange success) then (<color:red>no)
 *             :Revoke refreshToken;
 *             goto notIn
 *         else (<color:green> yes)
 *             label isIn
 *             :user is logged in;
 *             stop
 *         endif
 *     endif
 * else (<color:green>yes)
 *     if (is accessToken valid?) then (<color:red>no)
 *         label spacer
 *         goto newAccessToken;
 *     else (<color:green> yes)
 *         label spacer
 *         label spacer
 *         label spacer
 *         label spacer
 *         label spacer
 *         goto isIn
 *     endif
 * endif
 * @enduml
 *
 * @component
 * @group Popup
 * @returns the PopupBody component
 */
export const PopupBody = () => {
    const { setLoader } = useLoaderStore();
    const user = useUser();
    const { setAccessToken, logout } = useActions();

    useEffect(() => {
        (async () => {

            if (user.accessToken  && user.refreshToken) {
                setLoader(true);
                try {
                    await sendMessage('GetValidAccessToken', undefined);
                } catch (error) {
                    log('Error obtaining valid access token, logging out', error);
                }
                finally {
                    setLoader(false);
                }
            } else setLoader(false);
        })();
    }, [setLoader, setAccessToken, logout]);


    // Show Login if any required field is missing, otherwise GoToSheet
    return (!user.accessToken || !user.spreadsheetId || !user.refreshToken)
        ? <LoginButton/>
        : <GoToSheetButton spreadsheetId={user.spreadsheetId as string}/>;
};