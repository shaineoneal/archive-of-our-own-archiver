import { useState } from 'react';
import { removeToken } from '../chrome-services';
import { User } from '../types/user';
import { getActions, useActions, useUser } from '../utils/zustand';
import { revokeTokens } from '../chrome-services/refreshToken';
import log from '../utils/logger';

export const Logout = () => {
    const [style, setStyle] = useState("");
    const accessToken = useUser().accessToken;
    const { logout } = useActions();

    const handleLogout = async () => {
        log("handleLogout");
        //setStyle("visited");
        if (accessToken !== undefined) {
            log("revokeTokens");
            //TODO: FIX THIS
            //revokeTokens(accessToken); // this line breaks the entire content script
            //bc its trying to access chrome sync storage??

        }
        // TODO: needs to still logout if the user does not have a refresh token
        // AKA if it expires
        //logout();
    };

    return (
        <div >
            <a className='no-underline' href="popup.html">
                <button className={style} onClick={handleLogout} >Logout</button>
            </a>
        </div>
    );
};

export default Logout;
