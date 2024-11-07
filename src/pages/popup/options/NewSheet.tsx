import { createSpreadsheet } from '../../../utils/chrome-services';
import { useLoaderStore, useUser } from '../../../utils/zustand';

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
    const accessToken = useUser().accessToken;

    if (accessToken === undefined) {
        throw new Error('User is not logged in');
    }

    /**
     * Handles the creation of a new Google Sheet.
     * Sets the loader state to true while the spreadsheet is being created.
     * Stores the spreadsheet URL in Chrome's sync storage.
     */
    const handleNewSheet = async () => {
        setLoader(true);
        createSpreadsheet(accessToken)
        .then((url) => {
            chrome.storage.sync.set({ spreadsheetUrl: url });
        })
        .finally(() => {
            setLoader(false);
        });
    };

    if (loader) {
        return <div className="small loader"></div>;
    }

    return (
        <div>
            <button onClick={handleNewSheet}>New Sheet</button>
        </div>
    );
};
