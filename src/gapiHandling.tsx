/*import { useUser } from "./useUser";
import { UserContext } from "./contexts/URLContext";
import React, { useEffect, useState } from "react";
import { UserType } from "./user";


function removeAuthToken() {

    const token = getAuthToken();
    
    chrome.identity.removeCachedAuthToken({ token: "" }, () => {
        fetch(
            "https://accounts.google.com/o/oauth2/revoke?token=" + token,
            { method: "GET" }
        ).then((response) => {
            console.log("logout response", response);
        });
    });
}*/
