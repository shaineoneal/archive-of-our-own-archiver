import { log } from '../utils';
import { LoaderContext } from '../contexts';
import { useContext } from 'react';
import { launchWebAuthFlow } from '../chrome-services/utils/oauthSignIn';
import { getCookie } from '../chrome-services/utils/cookies';



export const AuthLogin = () => {    log('AuthLogin');
    const { loader, setLoader } = useContext(LoaderContext);

    const handleLogin = async () => {
        log('handleOauthLogin');
        setLoader(true);
        
        launchWebAuthFlow(true);
        setLoader(false);
    };

    return (
        <>
            <h1>Please log in to begin</h1>
            <div className="login">
                <button
                    id="login-button"
                    onClick={() => handleLogin()}
                    disabled={loader}
                >
                    TestButton
                </button>
            </div>
        </>
    );
}