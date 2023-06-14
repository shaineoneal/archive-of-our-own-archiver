import React from "react";
//import { userAuth } from "./Login";

function removeSheetURL() {
    chrome.storage.sync.remove(["sheetURL"], () => {
        console.log("sheet URL removed");
    });
}



export const Logout = () => {
   // const { logout } = userAuth();

    const handleLogout = () => {
        removeSheetURL();
        //logout();
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