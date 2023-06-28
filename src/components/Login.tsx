import React, { useState, useContext } from "react";
import { fetchToken } from "../chrome-services/authToken";
import { UserContext } from "../contexts";
import { fetchSheetURL } from "../chrome-services/sheet";
import { log } from "../utils/logger";



export const Login = () => {

    const { user, setUser, getUser } = useContext(UserContext);
    const [loader, setLoader] = useState(false);

    async function handleLogin() {
        setLoader(true);
        const token = await fetchToken(true);
        if (token === null) {
            throw new Error("Error getting token");
        }
        fetchSheetURL(token).then(async (url) => {
            log("handleLogin url: ", url);

            setUser({
                authToken: token,
                sheetId: url.split("/")[5],
                sheetUrl: url,
            });
            chrome.storage.sync.set({ userInfo: await getUser() });
            log("await getUser: ", getUser());
            setLoader(false);      
        });
  }

  
    return (
      <>
      <h1>Please log in to begin</h1>
      <div className="login">
        <button id="login-button" onClick={handleLogin} disabled={loader}>
          Login to Google
        </button>
      </div>
      </>
    );
  };
