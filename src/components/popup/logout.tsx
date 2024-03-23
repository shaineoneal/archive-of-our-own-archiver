import { ReactElement, useContext } from "react";
import { LoaderContext, RefreshTokenContext } from "../../contexts";
import { AuthFlowResponse, chromeLaunchWebAuthFlow, requestAuthorizaton } from "../../chrome-services/oauth";
import log from "../../utils/logger";
import { syncStorageGet, syncStorageSet } from "../../chrome-services/storage";
import { NoRefreshToken } from "./NoRefreshToken";
import { fetchSpreadsheetUrl } from "../../chrome-services/spreadsheet";
import { removeAccessToken } from "../../chrome-services";

/**
 * The LogoutButton component is a button that triggers a logout process and updates the loader state
 * while handling the logout flow.
 * 
 * @category Component
 * @group Popup
 * @returns the LogoutButton component 
 * ```tsx
 * <div>
 *      <button>
 *          Logout
 *      </button>
 * </div>
 * ```
 */
export function LogoutButton(): ReactElement {

    const { isLoading, setLoader } = useContext(LoaderContext);
    const { refreshToken, setRefreshToken } = useContext(RefreshTokenContext);

    /**
     * Handler for the logout button click event.
     * Starts OAuth flow, updates the loader state, and handles the response.
     * 
     * @notExported
     */
    
    const handleLogout = async () => {
        setLoader(true);
        log ('Remove token button clicked');
        syncStorageGet('access_token').then((token) => {
            if (token) {
                log ('token to remove: ' + token);
                removeAccessToken().then(() => {
                    console.log('Token removed');
                }).then(() => {
                    setLoader(false);
                });
            }
        });


    }

        return (

            <div>
                <button
                    className="logout-button"
                    onClick={handleLogout}
                    disabled={isLoading}
                >
                    Logout
                </button>
            </div>
        )
    }