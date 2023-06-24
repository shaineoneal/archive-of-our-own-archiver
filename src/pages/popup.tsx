import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { IconContext } from "react-icons";
import { BsFillGearFill } from "react-icons/bs";
import { PopupBody } from "../components/popup_body";
import { LoaderContext } from "../contexts/LoaderContext";
import { LoginContext } from "../contexts/LoginContext";
import "../styles.css";

const Popup = () => {
  const [loader, setLoader] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <>
      <header>
        <div className="flex-container">
          <div className="logo">
            <img src="icons/icon-32.png" alt="extension-icon" />
          </div>
          <div className="title">AO3E: Rewritten</div>
          <IconContext.Provider value={{ className: "settings-icon" }}>
            <a href="options.html">
              <BsFillGearFill />
            </a>
          </IconContext.Provider>
        </div>
      </header>
      <main>
        <LoaderContext.Provider value={{ loader, setLoader }}>
          <LoginContext.Provider value={{ loggedIn, setLoggedIn }}>
            <div className="body">
              <PopupBody />
            </div>
          </LoginContext.Provider>
        </LoaderContext.Provider>
      </main>
    </>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
