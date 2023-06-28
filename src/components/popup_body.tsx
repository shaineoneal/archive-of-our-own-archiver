import { GoToSheet, Login } from "../components"

import React, { useContext, useEffect } from "react";
import { LoaderContext } from "../contexts/LoaderContext";
import { UserContext, doesUserExist } from '../contexts/UserContext';
import { log } from "../utils/logger";
import { getSyncedUser } from "../chrome-services/syncedUser";

export const PopupBody = () => {
  //begin with loader on
  const { loader, setLoader } = useContext(LoaderContext);
  const { user, setUser } = useContext(UserContext);

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



  return (
    <>
      <div
        className="loader"
        style={loader ? { display: "flex" } : { display: "none" }}
      ></div>
      {!doesUserExist(user) ? <Login /> : <GoToSheet />}
    </>
  );
};

export default PopupBody;
