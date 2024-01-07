import { useContext } from "react";
import { LoaderContext } from "../../contexts";
import { chromeLaunchWebAuthFlow, getTokenFromAuthCode } from "../../chrome-services/oauth";
import log from "../../utils/logger";

export const LoginButton = () => {

    const { loader, setLoader } = useContext(LoaderContext);


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
                log(response);
                getTokenFromAuthCode(response.url, response.code).then((token) => {
                    log(token);
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