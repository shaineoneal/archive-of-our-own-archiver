import { log } from '../utils';
import { LoaderContext } from '../contexts';
import { useContext } from 'react';
import { oauthSignIn } from '../chrome-services/utils/oauthSignIn';



export const AuthLogin = () => {    log('AuthLogin');
    const { loader, setLoader } = useContext(LoaderContext);

    const handleLogin = () => {
        log('handleOauthLogin');
        setLoader(true);
        oauthSignIn();
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