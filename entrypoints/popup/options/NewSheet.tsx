import { createSpreadsheet } from '@/utils/browser-services';
import { SyncUserStore, useActions, useLoaderStore } from '@/utils/zustand';

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
    let { accessToken, spreadsheetId } = SyncUserStore.getState().user;
    const setSpreadsheetId = useActions().setSpreadsheetId;

    if (accessToken === undefined) {
        return null;
    }


    /**
     * Handles the creation of a new Google Sheet.
     * Sets the loader state to true while the spreadsheet is being created.
     * Stores the spreadsheet URL in Chrome's sync storage.
     * updates the url in the options page.
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
