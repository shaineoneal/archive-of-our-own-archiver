import React from "react";
import { removeToken } from "../hooks/authToken";
import { LoginContext } from "../contexts/LoginContext";

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