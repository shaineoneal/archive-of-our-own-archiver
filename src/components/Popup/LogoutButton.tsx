import { useState } from 'react';
import { revokeTokens } from "@/services";
import { useActions, useUser } from '@/stores';
import { Button } from '@mantine/core';

export const LogoutButton = () => {
    const [style, setStyle] = useState("");
    const accessToken = useUser().accessToken;
    const { logout } = useActions();

    const handleLogout = async () => {
        logger.debug("handleLogout");
        //setStyle("visited");
        if (accessToken !== undefined) {
            logger.debug("revokeTokens");
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
            <Button className={style} onClick={handleLogout} >Logout</Button>
        </div>
    );
};

export default LogoutButton;
