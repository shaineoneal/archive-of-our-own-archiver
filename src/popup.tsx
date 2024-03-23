import { ReactElement, useContext, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { doesUserHaveRefreshToken } from ".";
import { syncStorageGet } from "./chrome-services/storage";
import { retrieveAccessToken, retrieveRefreshToken, revokeRefreshToken } from "./chrome-services/tokens";
import { LoginButton, OptionsIcon } from "./components";
import { NoRefreshToken } from "./components/popup/NoRefreshToken";
import { LoaderContext, LoaderProvider, AccessTokenContext, AccessTokenProvider, RefreshTokenContext, RefreshTokenProvider } from "./contexts";
import "./styles/popup.css";
import log from "./utils/logger";

const Loader = () => {
    return <div className="loader"></div>;
}
const RemoveRefreshToken = () => {
    const { setLoader } = useContext(LoaderContext);
    const { setRefreshToken } = useContext(RefreshTokenContext);

    const handleRemoveRefreshToken = () => {
        setLoader(true);
        log ('Remove token button clicked');
        syncStorageGet('Refresh_token').then((token) => {
            if (token) {
                log ('token to remove: ' + token);
                revokeRefreshToken(token).then(() => {
                       console.log('Token revoked');
                }).then(() => {
                    setRefreshToken('');
                    setLoader(false);
                });
            }
        });
    }

    return (
        <button className="remove-token" onClick={handleRemoveRefreshToken}>
            Remove token
        </button>
    );
}

export function PopupBody(): ReactElement {
    const { isLoading, setLoader } = useContext(LoaderContext);
    const { refreshToken, setRefreshToken } = useContext(RefreshTokenContext);
    const { accessToken, setAccessToken } = useContext(AccessTokenContext);

    log('PopupBody() called', 'accessToken: ' + refreshToken);

    useEffect(() => {
        async function checkAccessToken() {
            const accessToken = await retrieveAccessToken();
            if (accessToken) {
                setAccessToken(accessToken);
                log('User has access token');

            } else {
                log('User does not have access token');
            }
        }
        checkAccessToken().then(() => {
            setLoader(false);
        });
        //to ensure that access token reloads
    }, [refreshToken]);

    if (isLoading) {
        return (
            <Loader />
        );
    } else {
        switch (accessToken) {
            case 'error':
                return (
                    <div className="not-logged-in">
                        <NoRefreshToken />
                    </div>
                );
            case '':
                return (
                    <div className="not-logged-in">
                        <LoginButton />
                    </div>
                );
            default:
                return (
                    <div className="logged-in">
                        <h1> You are logged in! </h1>
                    </div>
                );
        }
    }
}


/**
 * Main Popup UI component.
 * Renders header, content based on auth state.
 * 
 * @category Component
 * @group Popup
 * @returns {ReactElement} `<Popup />` component.   
 */
export const Popup = (): ReactElement => {

    useEffect(() => {
      //to ensure that the options icon reloads when the user logs in
    }, []);


    return (
        <div id="app-container">
        <AccessTokenProvider>
            <header>
                <div className="flex-container popup">
                    <div className="logo">
                        <img src="icons/icon-32.png" alt="extension-icon" />
                    </div>
                    <h1 className="title">AO3E: Rewritten</h1>
                    <OptionsIcon />
                </div>
            </header>
            <main>
                <LoaderProvider>
                    <div className="body">
                        {<PopupBody />}
                    </div>
                </LoaderProvider>
            </main>
        </AccessTokenProvider>
        </div>
    )

};

export const root = createRoot(document.getElementById("root")!);

root.render(
        <Popup />
);
