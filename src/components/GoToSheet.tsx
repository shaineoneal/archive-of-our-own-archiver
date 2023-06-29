import { log } from "../utils/logger";

export const GoToSheet = (props: any) => {

    function handleGoToSheet() {
        log("going to url: ", props.sheetUrl);
        chrome.tabs.create({ url: props.sheetUrl });
    }

    return (
        <div className="loggedIn">
            <button id="sheet-button" onClick={handleGoToSheet}>
                View your sheet
            </button>
        </div>
    );
};
