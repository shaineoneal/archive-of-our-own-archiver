import React, { useContext, useEffect } from "react";
import { checkLoginStatus } from "../background/checkLoginStatus";
import { LoaderContext } from "../contexts/LoaderContext";
import { LoginContext } from "../contexts/LoginContext";
import { fetchToken } from "../hooks/authToken";
import { fetchSheetURL } from "../hooks/sheet";
import { LoggedIn } from "../pages/LoggedIn";
import { log } from "../utils/logger";

export const PopupBody = () => {
  //begin with loader on
  const { loader, setLoader } = useContext(LoaderContext);
  const { loggedIn, setLoggedIn } = useContext(LoginContext);

  useEffect(() => {
    log("useEffect");
    log("loggedIn: ", loggedIn);
    async function checkLoggedIn() {
      log("checkLoggedIn");
      setLoggedIn(await checkLoginStatus());
    }
    checkLoggedIn();
    if (loggedIn === false) {
      setLoader(false);
    }
  }, [loggedIn]);

  async function handleLogin() {
    setLoader(true);
    const token = await fetchToken(true);
    if (token === null) {
      throw new Error("Error getting token");
    }
    chrome.storage.sync.set({ isLoggedIn: true });
    await fetchSheetURL(token);
    setLoader(false);
    setLoggedIn(true);
  }

  const Login = () => {
    return (
      <div className="login">
        <button id="login-button" onClick={handleLogin} disabled={loader}>
          Login to Google
        </button>
      </div>
    );
  };

  return (
    <>
      <div
        className="loader"
        style={loader ? { display: "flex" } : { display: "none" }}
      ></div>
      {loggedIn ? <LoggedIn /> : <Login />}
    </>
  );
};

export default PopupBody;
