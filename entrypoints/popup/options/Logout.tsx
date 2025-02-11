import { useState } from 'react';
import { revokeTokens } from "@/utils/browser-services";
import { log } from '@/utils';
import { useActions, useUser } from '@/utils/zustand';

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
            logout();
            await revokeTokens(accessToken);
        }
        // TODO: needs to still logout if the user does not have a refresh token
        //  AKA if it expires
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
