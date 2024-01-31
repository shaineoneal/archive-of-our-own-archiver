import { ReactElement, useContext} from "react";
import { RefreshTokenContext } from "../../contexts";
import { syncStorageSet } from "../..";


/**
 * Renders a component that displays instructions for fixing the absence of a refresh token.
 * 
 * @reactComponent
 * @group Popup
 * @subcategory Components
 * @category Component
 * @returns The rendered component.
 */
export const NoRefreshToken = (): ReactElement => {

    syncStorageSet('refresh_token', '');

    return (
        <div>
            <p>No Refresh Token! Here's how to fix it:</p>
            <p>1. Go to <a href="https://myaccount.google.com/connections?filters=3">
                https://myaccount.google.com/connections?filters=3</a>
            </p>
            <p>2. Find "kudos-extension" and go to its page.</p>
            <p>3. Click "Delete all connections you have with kudos-extension."</p>
            <p>4. Return to the extension and log in again.</p>
        </div>
    )
}