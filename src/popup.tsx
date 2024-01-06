import React, { useContext, useEffect, useState } from "react";
import { LoaderProvider, AuthTokenContext,AuthTokenProvider, LoaderContext } from "./contexts";
import { OptionsIcon } from "./components";
import { createRoot } from "react-dom/client";

const notLoggedIn = () => {
    return (
        <div className="not-logged-in">
            <p>Not logged in.</p>
            <p>
                Please log in to your AO3 account and refresh the page.
            </p>
        </div>
    );
}

const Popup = () => {
    const { loader } = useContext(LoaderContext);
    const { authToken } = useContext(AuthTokenContext);

    useEffect(() => {
      //to ensure that the options icon reloads when the user logs in
    }, [loader, authToken]);


    return (
        <AuthTokenProvider>
            <header>
                <div className="flex-container popup">
                    <div className="logo">
                        <img src="icons/icon-32.png" alt="extension-icon" />
                    </div>
                    <div className="title">AO3E: Rewritten</div>
                    <OptionsIcon />
                </div>
            </header>
            <main>
                <LoaderProvider>
                    <div className="body">
                    </div>
                </LoaderProvider>
            </main>
        </AuthTokenProvider>
    )

};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
