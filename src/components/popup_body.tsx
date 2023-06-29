import { GoToSheet, Login } from "../components"

import React, { useContext, useEffect, useState } from "react";
import { LoaderContext } from "../contexts/LoaderContext";
import { log } from "../utils/logger";
import { fetchSheetUrl } from "../chrome-services/sheet";
import { useGetSet, useGetSetState } from "react-use";
import { fetchToken } from "../chrome-services/authToken";
import { TokenContext } from "../contexts";




export const PopupBody = () => {
  //begin with loader on
  const { loader, setLoader } = useContext(LoaderContext);
  const [sheetUrl, setSheetUrl] = useState<string>("");
  const [authToken, setAuthToken] = useState<string>("");

  useEffect(() => {
    log("useEffect"); 

    async function getUserInfo() {
        fetchToken(false).then((token) => {
            if(token === "") log("user is not logged in")  //can be removed when fetchToken is fixed
            setAuthToken(token);
        });
      
        fetchSheetUrl().then((url) => {
            log("url: ", url);
            setSheetUrl(url);
        });
    }

    getUserInfo().then(() => { setLoader(false) });

  }, [authToken]);


  if (loader) {
    log("loader is true");
    return ( <div className="loader"></div> );

  } else {
      return (
        <>
            <TokenContext.Provider value={{authToken, setAuthToken}}>
                <div>{(!authToken) ? <Login /> : <GoToSheet sheetUrl={sheetUrl}/>}</div>
            </TokenContext.Provider>
        </>
      );
  }
};




export default PopupBody;
