import { useContext } from "react";
import { LoaderContext, RefreshTokenContext } from "../../contexts";
import { chromeLaunchWebAuthFlow, getTokenFromAuthCode } from "../../chrome-services/oauth";
import log from "../../utils/logger";
import { syncStorageSet } from "../../chrome-services/storage";
import { NoRefreshToken } from "./NoRefreshToken";

export const LoginButton = () => {

    const { loader, setLoader } = useContext(LoaderContext);
    const { refreshToken, setRefreshToken } = useContext(RefreshTokenContext);


    const handleLogin = async () => {
        console.log('Login button clicked');

        setLoader(true);

        chromeLaunchWebAuthFlow().then((response) => {
            if (chrome.runtime.lastError ) {

                if (chrome.runtime.lastError) {
                    log(chrome.runtime.lastError.message);
                }
                setLoader(false);
            } else if (response.url && response.code) {
                getTokenFromAuthCode(response.url, response.code).then((response) => {
                    syncStorageSet('access_token', response.access_token);
                    if (response.refresh_token) {
                        setRefreshToken(response.refresh_token);
                        syncStorageSet('refresh_token', response.refresh_token);
                        return NoRefreshToken;
                    } else { 
                        setRefreshToken('error');
                        syncStorageSet('refresh_token', 'error');
                    }
                    //chrome.runtime.reload();
                    setLoader(false);
                });
            }
    });

    }

    return (
        <div>
            <button
                className="login-button"
                onClick={handleLogin}
                disabled={loader}
            >
                Login
            </button>
        </div>
    )
}