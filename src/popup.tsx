import { ReactElement, useContext, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { doesUserHaveRefreshToken } from ".";
import { syncStorageGet } from "./chrome-services/storage";
import { retrieveRefreshToken, revokeToken } from "./chrome-services/tokens";
import { LoginButton, OptionsIcon } from "./components";
import { NoRefreshToken } from "./components/popup/NoRefreshToken";
import { AuthTokenContext, LoaderContext, LoaderProvider, RefreshTokenContext, RefreshTokenProvider } from "./contexts";
import "./styles/popup.css";
import log from "./utils/logger";

const Loader = () => {
    return <div className="loader"></div>;
}

const RemoveToken = () => {
    const { setLoader } = useContext(LoaderContext);
    const { setRefreshToken } = useContext(RefreshTokenContext);

    const handleRemoveToken = () => {
        setLoader(true);
        log ('Remove token button clicked');
        syncStorageGet('refresh_token').then((token) => {
            if (token) {
                log ('token to remove: ' + token);
                revokeToken(token).then(() => {
                       console.log('Token revoked');
                }).then(() => {
                    setRefreshToken('');
                    setLoader(false);
                });
            }
        });
    }

    return (
        <button className="remove-token" onClick={handleRemoveToken}>
            Remove token
        </button>
    );
}

export function PopupBody(): ReactElement {
    const { isLoading, setLoader } = useContext(LoaderContext);
    const { refreshToken, setRefreshToken } = useContext(RefreshTokenContext);

    log('PopupBody() called', 'refreshToken: ' + refreshToken);

    useEffect(() => {
        async function checkRefreshToken() {
            const refreshToken = await doesUserHaveRefreshToken();
            if (refreshToken) {
                setRefreshToken(refreshToken);
            } else {
                setRefreshToken('');
                log('User does not have refresh token');
            }
        }

        checkRefreshToken().then(() => {
            setLoader(false);
        });
        //to ensure that refresh token reloads
    }, [refreshToken]);

    if (isLoading) {
        return (
            <Loader />
        );
    } else {
        switch (refreshToken) {
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
                        <RemoveToken />
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
        <RefreshTokenProvider>
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
        </RefreshTokenProvider>
        </div>
    )

};

export const root = createRoot(document.getElementById("root")!);

root.render(
        <Popup />
);
