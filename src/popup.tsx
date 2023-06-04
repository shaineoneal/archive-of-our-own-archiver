import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BsFillGearFill } from "react-icons/bs";
import "./popup.css";

const Popup = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false); 

    useEffect(() => {
        const checkLoginStatus = async () => {
            const result = await new Promise((resolve) => {
                chrome.storage.sync.get(["isLoggedIn"], (result) => {
                    setIsLoggedIn(result.isLoggedIn);
                    resolve(result);
                });
            });
            return result;
        };

        checkLoginStatus();

    }, []);
 
    const handleLogin = async() => {
        try {
            const result = await new Promise<string>((resolve) => {
                chrome.runtime.sendMessage({ reason: "login" }, (response) => {
                    console.log("response received", response);
                    resolve(response);
                });
            });

            if (result && result === "success") {
                console.log("login success in handleLogin");
                //successful login
            } else {
                console.log("login failed in handleLogin");
                //failed login
            }
        }
        catch (error) {
            console.log("error handling response", error);
        }
    
    };


    return (
        <>
            <header>
                <div className="flex-container">
                    <div className="logo">
                        <img src="icon.png" alt="extension-icon"/>
                    </div>
                    <div className="title">AO3E: Rewritten Extension</div>
                    <div className="settings">
                        <a href="settings.html">
                            <BsFillGearFill />
                        </a>
                    </div>
            
                </div>
            </header>
            <main>
                <button onClick={handleLogin} disabled={!isLoggedIn}>
                    {!isLoggedIn ? "Logged In!" : "Login"}
                </button>
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
