import { isAccessTokenValid } from '../chrome-services';
import { exchangeRefreshForAccessToken, getLocalAccessToken } from '../chrome-services/accessToken';
import { chromeLaunchWebAuthFlow, requestAuthorizaton, AuthFlowResponse, AuthRequestResponse } from '../chrome-services/utils/oauthSignIn';
import log from '../utils/logger';

export const GoToSheet = (props: any) => {
    function handleGoToSheet() {
        const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${props.spreadsheetId}/edit#gid=0`;
        log('going to url: ', props.spreadsheetId);
        chrome.tabs.create({ url: spreadsheetUrl });
    }

    return (
        <div className="loggedIn">
            <button id="sheet-button" onClick={handleGoToSheet}>
                View your sheet
            </button>
            <button
                    id="test-button"
                    //onClick={() => exchangeRefreshForAccessToken().then((token) => isAccessTokenValid(token.access_token) ) }
                >
                    Test
                </button>
        </div>
    );
};
