import React, { useEffect, useState, useContext } from "react";
import { createRoot } from "react-dom/client";
import { IconContext } from "react-icons";  
import { BsFillGearFill } from "react-icons/bs";
import { PopupBody } from "./popup_body";
import { LoginContext, useLogin } from "./contexts/LoginContext";
import { Loader } from "./components/Loader";
import "./popup.css";
import { LoaderContext } from "./contexts/LoaderContext";

const Popup = () => {
   
    const [loader, setLoader] = useState(true);
    const [ loggedIn, setLoggedIn ] = useState(false);

    //console.log("loggedIn: ", loggedIn);

    return (
        <>
            <header>
                <div className="flex-container">
                    <div className="logo">
                        <img src="icons/icon-32.png" alt="extension-icon"/>
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
                            <PopupBody/>
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
