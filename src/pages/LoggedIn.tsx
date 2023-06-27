import React, { useContext, useEffect } from "react";
import { LoaderContext } from "../contexts/LoaderContext";
import { fetchToken } from "../hooks/authToken";
import { fetchSheetURL, fetchSheetID } from "../hooks/sheet";
import { User, UserContext } from "../contexts/UserContext";
import { log } from "../utils/logger";

export const LoggedIn = () => {
  const { loader, setLoader } = useContext(LoaderContext);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    if (user === null) {
      throw new Error("User not found");
    }
    
    setLoader(false);
  }, []);

  function handleGoToSheet() {
    log("url: ", user?.sheetUrl);
    chrome.tabs.create({ url: user?.sheetUrl });
  }
  function fetchUserInfo(): User | null {
    chrome.storage.sync.get(["userInfo"], async (result) => {
      log("result ", result);
      log("result userInfo ", result.userInfo);
      if (result.userInfo) {
        return result.userInfo;
      }
    });
    return null;
  }


  return (
    <div>
      <div className="loggedIn">
        <button id="sheet-button" onClick={handleGoToSheet} disabled={loader}>
          View your sheet
        </button>
        
      </div>
    </div>
  );
};
