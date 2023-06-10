import React from "react";
import { checkUserStatus } from "../useUser";
import { userAuth } from "./Login";

const Logout = () => {
    const { logout } = userAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <div>
            <button onClick={handleLogout} disabled={!checkUserStatus()}>
                {!checkUserStatus() ? "Logged Out!" : "Logout"}
            </button>
        </div>
    );
}
export default Logout;