import React, { useContext, useEffect } from "react";
import { LoaderContext } from "../contexts/LoaderContext";
import { UserContext } from "../contexts/UserContext";
import { log } from "../utils/logger";

export const GoToSheet = () => {
    const { user } = useContext(UserContext);

    function handleGoToSheet() {
        log("url: ", user?.sheetUrl);
        chrome.tabs.create({ url: user?.sheetUrl });
    }

  return (
      <div className="loggedIn">
          <button id="sheet-button" onClick={handleGoToSheet}>
              View your sheet
          </button>
      </div>
  );
};
