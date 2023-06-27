import React, { useState } from "react";
import ReactDOM from "react-dom";
import { log } from "../utils/logger";
import { IconContext } from "react-icons";
import { BsFillGearFill } from "react-icons/bs";
import { PopupBody } from "../components/popup_body";
import { LoginContext } from "../contexts/LoginContext";
import { User, UserContext } from "../contexts/UserContext";
import useSetState from "../utils/useSetState";
import "../styles.css";

const Popup = () => {
  const [ user, setUser, getUser ] = useSetState<User>({authToken: "", sheetId: "", sheetUrl: ""});
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
        <UserContext.Provider value={{ user, setUser, getUser }}>
          <LoginContext.Provider value={{ loggedIn, setLoggedIn }}>
            <div className="body">
              <PopupBody />
              
            </div>
          </LoginContext.Provider>
        </UserContext.Provider>
      </main>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
)
