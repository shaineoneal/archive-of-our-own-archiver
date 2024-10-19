import log from '../utils/logger';
import { TestingButton } from './testingButton';

/**
 * Component that displays a button to go to the user's sheet.
 * @param props.spreadsheetId The id of the spreadsheet to go to.
 * @returns A button that when clicked will go to the user's sheet.
 */
export const GoToSheet = (props: { spreadsheetId: string }) => {
    const handleGoToSheet = () => {
        chrome.tabs.create({ url: `https://docs.google.com/spreadsheets/d/${props.spreadsheetId}/edit#gid=0` });
    };

    return (
        <div className="loggedIn">
            <TestingButton />
            <button id="sheet-button" onClick={handleGoToSheet}>
                View your sheet
            </button>
        </div>
    );
};
