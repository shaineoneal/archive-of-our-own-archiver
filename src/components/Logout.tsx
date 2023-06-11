import React from "react";
import { useUser } from "../useUser";
//import { userAuth } from "./Login";

const Logout = () => {
   // const { logout } = userAuth();

    const handleLogout = () => {
     //   logout();
    };

    return (
        <div>
            <button onClick={handleLogout} disabled={!useUser().user}>
                {!useUser().user ? "Logged Out!" : "Logout"}
            </button>
        </div>
    );
}
export default Logout;