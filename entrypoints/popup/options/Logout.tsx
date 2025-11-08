import { useState } from 'react';
import { revokeTokens } from "@/utils/browser-services";
import { useActions, useUser } from '@/utils/zustand';
import { Button } from "@mantine/core";
import { sendMessage } from '@/utils/browser-services/messaging';
import { useForceUpdate } from "@mantine/hooks";

export const Logout = () => {
    const [style, setStyle] = useState("");
    const accessToken = useUser().accessToken;
    const { logout } = useActions();

    const handleLogout = async () => {
        console.log("handleLogout");
        try {
            await sendMessage('Logout', undefined);
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            //window.location.href = "popup.html";
        }

    };

    return (
        <Button className={style} onClick={handleLogout} >Logout</Button>
    );
};

export default Logout;
