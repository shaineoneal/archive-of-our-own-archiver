import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { IconContext } from "react-icons";
import { BiArrowBack } from "react-icons/bi";
import { Logout, ForgetSheet } from "../components";
import { log } from "../utils/logger";
import "../styles.css";

export function openOptionsPage() {
  chrome.runtime.openOptionsPage();
}

const Options = () => {
  const [sheetURL, setSheetUrl] = useState<string>("");

  useEffect(() => {
  
    const getSheetURL = async () => {
      const result = await new Promise((resolve) => {
        chrome.storage.sync.get(["sheetURL"], (result) => {
          log("sheet URL", result.sheetURL);
          setSheetUrl(result.sheetURL);
          resolve(result);
        });
      });
      return result;
    };
    getSheetURL();
  }, []);

  return (
    <>
      <header>
        <div className="flex-container">
          <IconContext.Provider value={{ className: "back-icon" }}>
            <a href="popup.html">
              <BiArrowBack />
            </a>
          </IconContext.Provider>
          <div className="title">AO3E Rewritten&apos;s Options</div>
        </div>
      </header>
      <main>
        <div className="options-container">
          <div>Google Sheets URL</div>
          <input type="text" value={sheetURL}/>
          <Logout />
          <ForgetSheet />
        </div>
      </main>
      <div></div>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
  document.getElementById("root")
);
