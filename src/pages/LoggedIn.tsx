import React, { useContext, useEffect } from "react";
import { LoaderContext } from "../contexts/LoaderContext";
import { fetchToken } from "../hooks/authToken";
import { fetchSheetURL,fetchSheetID } from "../hooks/sheet";
import { log } from "../utils/logger";



export const LoggedIn = () => {

    const { loader, setLoader } = useContext(LoaderContext);
    const [url, setURL] = React.useState<string>("");

    useEffect(() => {
        async function getURL() {
            log("getURL");
            //log("sheetid: ", await fetchSheetID(await fetchToken(false)));
            const sheetURL = await fetchSheetURL(await fetchToken(false));
            setURL(sheetURL);
        }
        getURL();
        setLoader(false);
    }, []);

    function handleGoToSheet() {
        log("url: ", url);
        chrome.tabs.create({ url: url });
    }
    
    return (
        <div>
            <div className="loggedIn">
                <button id="sheet-button" onClick={handleGoToSheet} disabled={loader}>View your sheet</button>
            </div>
        </div>
    )
}