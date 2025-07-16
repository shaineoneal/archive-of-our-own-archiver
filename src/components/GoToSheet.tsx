import { isAccessTokenValid } from '../chrome-services';
import { fetchNewAccessToken, getLocalAccessToken } from '../chrome-services/accessToken';
import { chromeLaunchWebAuthFlow, requestAuthorizaton, AuthFlowResponse, AuthRequestResponse } from '../chrome-services/utils/oauthSignIn';
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
                    onClick={() => fetchNewAccessToken().then((token) => isAccessTokenValid(token) ) }
                >
                    Test
                </button>
        </div>
    );
};
