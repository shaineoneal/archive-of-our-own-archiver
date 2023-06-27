import React, { useContext, useEffect } from "react";
import { LoaderContext } from "../contexts/LoaderContext";
import { User, defaultUser, UserContext, doesUserExist } from '../contexts/UserContext';
import { fetchToken } from "../hooks/authToken";
import { fetchSheetURL } from "../hooks/sheet";
import { LoggedIn } from "../pages/LoggedIn";
import { log } from "../utils/logger";
import getState from "../utils/useSetState";
import { get } from "jquery";

export const PopupBody = () => {
  //begin with loader on
  const { loader, setLoader } = useContext(LoaderContext);
  const { user, setUser, getUser } = useContext(UserContext);

  useEffect(() => {
    log("useEffect");

    getSyncedUser().then((result) => {
      log("getSyncedUser result: ", result);
      if (result !== null) {
        setUser({
          authToken: result.authToken,
          sheetId: result.sheetId,
          sheetUrl: result.sheetUrl,
        });
        setLoader(false);
      }
    });
  }, []);

  async function getSyncedUser(): Promise<User | null> {
    return new Promise((resolve) => {
      chrome.storage.sync.get(["userInfo"], async (result) => {
        log("chrome sync get result ", result);
        log("chrome sync get result userInfo ", result.userInfo);
        if (result.userInfo) {
          resolve(result.userInfo);
        } else {
          resolve(null);
        }
      });
    });
  }

  async function handleLogin() {
    setLoader(true);
    const token = await fetchToken(true);
    if (token === null) {
      throw new Error("Error getting token");
    }
    fetchSheetURL(token).then(async (url) => {
      log("handleLogin url: ", url);

      setUser({
        authToken: token,
        sheetId: url.split("/")[5],
        sheetUrl: url,
      });
      chrome.storage.sync.set({ userInfo: await getUser() });
      log("await getUser: ", getUser());
      setLoader(false);      
    });
  }

  const Login = () => {
    return (
      <>
      <h1>Please log in to begin</h1>
      <div className="login">
        
        <button id="login-button" onClick={handleLogin} disabled={loader}>
          Login to Google
        </button>
      </div>
      </>
    );
  };

  return (
    <>
      <div
        className="loader"
        style={loader ? { display: "flex" } : { display: "none" }}
      ></div>
      {!doesUserExist(user) ? <Login /> : <LoggedIn />}
    </>
  );
};

export default PopupBody;
