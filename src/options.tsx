import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
//import useLoginStatus from "./login";
import { IconContext } from "react-icons";
import { BiArrowBack } from "react-icons/bi";
import Logout from "./components/Logout";
import "./popup.css"

export function openOptionsPage() {
  chrome.runtime.openOptionsPage();
}



const Options = () => {
  
  
  //const [loginStatus, toggleLoginStatus] = useLoginStatus();
  
  useEffect(() => {
    const getSheetURL = async () => {
      const result = await new Promise((resolve) => {
        chrome.storage.sync.get(["sheetURL"], (result) => {
          console.log("sheet URL", result.sheetURL);
          //setSheetURL(result.sheetURL);
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
          <input type="text"/>
          <Logout />
        </div>
      </main>
      <div></div>
    </>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);
