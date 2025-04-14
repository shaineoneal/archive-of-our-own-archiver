import { useState } from 'react';
import { revokeTokens } from "@/utils/browser-services";
import { useActions, useUser } from '@/utils/zustand';
import { Button } from "@mantine/core";

export const Logout = () => {
    const [style, setStyle] = useState("");
    const accessToken = useUser().accessToken;
    const { logout } = useActions();

    const handleLogout = async () => {
        console.log("handleLogout");
        //setStyle("visited");
        if (accessToken !== undefined) {
            console.log("revokeTokens");
            //TODO: FIX THIS
            logout();
            await revokeTokens(accessToken);
        }
        // TODO: needs to still logout if the user does not have a refresh token
        //  AKA if it expires
        //logout();
    };

    return (
        <Button className={style} onClick={handleLogout} >Logout</Button>
    );
};

export default Logout;
