import React, { useEffect, useState, useContext} from "react";
import { fetchToken } from './background/fetchToken';
import { getSheetURL } from "./background/sheet";
import { URLContext } from "./contexts/URLContext";
import { LoginContext, useLogin } from "./contexts/LoginContext";
import { Loader } from "./components/Loader";
import { LoaderContext } from "./contexts/LoaderContext";
//import getLoginStatus from './login';
//import Login from './components/Login';



export const PopupBody = () => {
    //begin with loader on
    const { loader, setLoader } = useContext(LoaderContext);
    const [url, setURL] = useState("");
    const { loggedIn, setLoggedIn } = useContext(LoginContext);

    async function handleLogin() {
    
        //if (!Loader) { throw new Error("No loader found"); }
        setLoader(true);
        const token = await fetchToken(true);
        chrome.storage.sync.set({ token: token });
        setURL(await getSheetURL(token));
        setLoader(false);
        setLoggedIn(true);

    }

    function handleGoToSheet() {
        console.log("url: ", url);
        chrome.tabs.create({ url: url });
    }

    const Login = () => {
        return (
            <div className="login">
                <div className="loader" style={ loader ? { display: "flex" } : { display: "none" }}></div>
                <button id="login-button" onClick={handleLogin} disabled={loader}>Login to Google</button>
            </div>
        )
    }

    const LoggedIn = () => {
        return (
            <div>
                <h1>Logged in</h1>
                <div className="loggedIn">
                    <button id="logout-button" onClick={handleGoToSheet}>View your sheet</button>
                </div>
            </div>
        )
    }


    return (
            <URLContext.Provider value = {{url, setURL}}>
                {loggedIn ? <LoggedIn /> : <Login />}
            </URLContext.Provider>
    )
}

export default PopupBody;
