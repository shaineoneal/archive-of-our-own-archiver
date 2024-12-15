import { createSpreadsheet } from '../../../utils/chrome-services';
import { useActions, useLoaderStore, useUser } from '../../../utils/zustand';
import { useEffect } from "react";
import log from "../../../utils/logger";

/**
 * Component for creating a new Google Sheet.
 * Allows users to create a new spreadsheet and store its URL in Chrome's sync storage.
 * Displays a loader while the spreadsheet is being created.
 * @component
 * @group Popup
 * @returns the NewSheet component
 */
export const NewSheet = () => {
    const { loader, setLoader } = useLoaderStore();
    const { accessToken, spreadsheetId } = useUser();
    const setSpreadsheetId = useActions().setSpreadsheetId;

    if (accessToken === undefined) {
        return null;
    }

    /**
     * Handles the creation of a new Google Sheet.
     * Sets the loader state to true while the spreadsheet is being created.
     * Stores the spreadsheet URL in Chrome's sync storage.
     */
    const handleNewSheet = async () => {
        setLoader(true);
        const id = await createSpreadsheet(accessToken)
        if (id) {
            setSpreadsheetId(id);
        }
        setLoader(false);
    };

    return (
        <div>
            <button
                id="new-sheet-button"
                onClick={ handleNewSheet }
            >
                New Sheet
            </button>
        </div>
    );
};
