import React, { useContext, useEffect } from "react";
import { LoaderContext } from "../contexts/LoaderContext";
import { log } from "../utils/logger";
import { fetchToken } from "../hooks/authToken";
import { fetchSheetURL, sheetURL } from "../hooks/sheet";



export const LoggedIn = () => {

    const { loader, setLoader } = useContext(LoaderContext);
    const [url, setURL] = React.useState<string>("");

    useEffect(() => {
        async function getURL() {
            log("getURL");
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