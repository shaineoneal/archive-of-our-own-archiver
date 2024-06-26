import { useContext } from 'react';
import { chromeLaunchWebAuthFlow } from '../chrome-services/utils/oauthSignIn';
import { LoaderContext } from '../contexts';
import log from '../utils/logger';



export const AuthLogin = () => {    log('AuthLogin');
    const { loader, setLoader } = useContext(LoaderContext);

    const handleLogin = async () => {
        log('handleOauthLogin');
        setLoader(true);
        
        chromeLaunchWebAuthFlow();
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