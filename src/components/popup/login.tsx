import { useContext } from "react";
import { LoaderContext } from "../../contexts";

export const LoginButton = () => {

    const { loader, setLoader } = useContext(LoaderContext);


    const handleLogin = async () => {
        console.log('Login button clicked');

        setLoader(true);

        
    }

    return (
        <div>
            <button
                className="login-button"
                onClick={handleLogin}
                disabled={loader}
                >Login</button>
        </div>
    )
}