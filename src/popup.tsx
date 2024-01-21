import React, { useContext, useEffect, useState } from "react";
import { LoaderProvider, AuthTokenContext,AuthTokenProvider, LoaderContext, RefreshTokenContext, RefreshTokenProvider } from "./contexts";
import { OptionsIcon } from "./components";
import { createRoot } from "react-dom/client";
import { LoginButton } from "./components";
import "./styles/popup.css";
import { retrieveRefreshToken, revokeToken } from "./chrome-services/tokens";
import log from "./utils/logger";
import { syncStorageGet } from "./chrome-services/storage";
import { NoRefreshToken } from "./components/popup/NoRefreshToken";

const RemoveToken = () => {

    const removeToken = () => {
        log ('Remove token button clicked');
        syncStorageGet('token').then((token) => {
            if (token) {
                log ('token to remove: ' + token);
               revokeToken(token).then(() => {
                       console.log('Token revoked');
                   });
               }
            }
        );
    }

    return (
        <button className="remove-token" onClick={removeToken}>
            Remove token
        </button>
    );
}

const AccessTokenRefresh = () => {

    const { authToken, setAuthToken } = useContext(AuthTokenContext);
    const { refreshToken } = useContext(RefreshTokenContext);
    const { loader, setLoader } = useContext(LoaderContext);

    const [refreshed, setRefreshed] = useState<boolean>(false);

    useEffect(() => {
        //to ensure that the access token refreshes
    }, [refreshToken]);

    useEffect(() => {
        if (refreshToken !== '') {
            retrieveRefreshToken().then((response) => {
                if (response) {
                    log('Access token refreshed');
                    setAuthToken(response);
                    setRefreshed(true);
                    setLoader(false);
                } else {
                    log('Access token not refreshed');
                    setRefreshed(false);
                    setLoader(false);
                }
            });
        }
    }, [refreshToken, setAuthToken, setLoader]);

    if (refreshed) {
        return (
            <div className="access-token-refresh">
                <p>Access token refreshed!</p>
            </div>
        );
    } else {
        return (
            <div className="access-token-refresh">
                <p>Access token not refreshed.</p>
            </div>
        );
    }
}

const notLoggedIn = () => {
    const { refreshToken } = useContext(RefreshTokenContext);

    useEffect(() => {
        //to ensure that refresh token reloads
    }, [refreshToken]);


    if (refreshToken === 'error') {
        return (
            <div className="not-logged-in">
                <NoRefreshToken />
            </div>
        );
    } else {

        return (
            <div className="not-logged-in">
                <p>Not logged in.</p>
                <LoginButton />
                <RemoveToken />
                <AccessTokenRefresh />
            </div>
        );
    }
}

const Popup = () => {
    const { loader } = useContext(LoaderContext);
    const { authToken } = useContext(AuthTokenContext);
    const { refreshToken } = useContext(RefreshTokenContext);

    useEffect(() => {
      //to ensure that the options icon reloads when the user logs in
    }, [loader, authToken, refreshToken]);


    return (
        <AuthTokenProvider>
        <RefreshTokenProvider>
            <header>
                <div className="flex-container popup">
                    <div className="logo">
                        <img src="icons/icon-32.png" alt="extension-icon" />
                    </div>
                    <div className="title">AO3E: Rewritten</div>
                    <OptionsIcon />
                </div>
            </header>
            <main>
                <LoaderProvider>
                    <div className="body">
                        {( refreshToken === 'error') ? NoRefreshToken() : notLoggedIn()}
                    </div>
                </LoaderProvider>
            </main>
        </RefreshTokenProvider>
        </AuthTokenProvider>
    )

};

const root = createRoot(document.getElementById("root")!);

root.render(
    <React.StrictMode>
        <Popup />
    </React.StrictMode>
);
