import { log } from "@/utils/logger.ts";
import { handleTokenExchange, main as bgMain } from "./background.ts";
import { createMessageHandlers, isAccessTokenValid, MessageName } from "@/utils/chrome-services";
import { MessageResponse } from "@/utils/types/MessageResponse";
import { SyncUserStore } from "@/utils/zustand";
import { setAccessTokenCookie } from "@/utils/chrome-services/cookies.ts";

export default defineBackground(() => {
    log('background script running');
    let syncUser = SyncUserStore.getState().user;
    createMessageHandlers({
        // Called when the popup is opened
        [MessageName.CheckLogin]: async (): Promise<MessageResponse<boolean>> => {
            log('checkLogin message received');
            const {setAccessToken} = SyncUserStore.getState().actions;
            log('syncUser', syncUser);
            if (syncUser.isLoggedIn && syncUser.refreshToken) {
                log('user is logged in');
                //setStore('user', syncUser, StoreMethod.SYNC);
                try {
                    if (syncUser.accessToken === undefined) {
                        log('no access token');
                        return {response: false};//return await handleTokenExchange<boolean>(syncUser.refreshToken);
                    }
                    const isValid = await isAccessTokenValid(syncUser.accessToken);
                    log('is access token valid', isValid);
                    if (isValid) {
                        setAccessToken(syncUser.accessToken);
                        await setAccessTokenCookie(syncUser.accessToken);
                        log('newAccessToken set');
                        return {response: true};
                    } else {
                        log('access token is not valid');
                        return {response: false};//await handleTokenExchange<boolean>(syncUser.refreshToken);
                    }
                } catch (error) {
                    log(error);
                    return {response: false};
                }
            } else {
                log('user is not logged in');
                return {response: false};
            }
            },
    });

});