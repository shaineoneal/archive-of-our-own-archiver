import React, { createContext, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { IconContext } from "react-icons";  
import { BsFillGearFill } from "react-icons/bs";
import Login, { userAuth } from "./components/Login";
import { UserContext } from "./Contexts/UserContext";
import { checkUserStatus } from "./useUser";
import Logout from "./components/Logout";
import "./popup.css";


const Popup = () => {

    useEffect(() => {
        console.log("popup");

    }, []);

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

                    {<Login />}
                    
                <div></div>
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
