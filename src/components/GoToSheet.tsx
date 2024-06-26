import { isAccessTokenValid } from '../chrome-services';
import { getSyncedRefreshToken } from '../chrome-services/refreshToken';
import log from '../utils/logger';

export const GoToSheet = (props: any) => {
    function handleGoToSheet() {
        log('going to url: ', props.spreadsheetUrl);
        chrome.tabs.create({ url: props.spreadsheetUrl });
    }

    return (
        <div className="loggedIn">
            <button id="sheet-button" onClick={handleGoToSheet}>
                View your sheet
            </button>
            <button
                    id="test-button"
                    onClick={() => getSyncedRefreshToken()}
                >
                    Test
                </button>
        </div>
    );
};
