import React, { useEffect, useState, useContext} from "react";
import { fetchToken } from './background/fetchToken';
import { getSheetURL } from "./background/sheet";
import { URLContext } from "./contexts/URLContext";
import { LoginContext } from "./contexts/LoginContext";
//import getLoginStatus from './login';
//import Login from './components/Login';


export function popupBody() {
    
    const [ loggedIn, setLoggedIn ] = useState(false);

    const [loader, setLoader] = useState(false);
    
    const [url, setURL] = useState("");

    async function handleLogin() {
    
        //if (!Loader) { throw new Error("No loader found"); }
        
        setLoader(true);
        const token = await fetchToken(true);
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
        <LoginContext.Provider value = {{loggedIn, setLoggedIn}}>
            <URLContext.Provider value = {{url, setURL}}>
                {loggedIn ? <LoggedIn /> : <Login />}
            </URLContext.Provider>
        </LoginContext.Provider>
    )
}

export default popupBody;
