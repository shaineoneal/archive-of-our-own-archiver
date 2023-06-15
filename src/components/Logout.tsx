import React from "react";
import { fetchToken } from "../background/fetchToken";
import { LoginContext } from "../contexts/LoginContext";

async function removeToken() {
    const token = await fetchToken(false);

    if (token === null) {
        throw new Error("Error getting token");
    }
    chrome.identity.removeCachedAuthToken({ token: token }, () => {
        fetch(
            "https://accounts.google.com/o/oauth2/revoke?token=" + token,
            { method: "GET" }
        ).then((response) => {
            console.log("logout response", response);
        });
    });
}



export const Logout = () => {
    const { setLoggedIn } = React.useContext(LoginContext);

    const handleLogout = () => {
        removeToken();
        setLoggedIn(false);
        chrome.storage.sync.set({ isLoggedIn: false });
    };

    return (
        <div>
            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}
export default Logout;