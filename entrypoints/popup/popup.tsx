import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { PopupBody } from './main/popup_body.tsx';
import { UserDataType, useUser } from '@/utils/zustand';
import { OptionsIcon } from '../../components/optionsIcon.tsx';
import {
    createTheme,
    MantineColorsTuple,
    MantineProvider,
    Container,
    AppShell,
    Flex,
    ActionIcon,
    Title, ThemeIcon, LoadingOverlay
} from "@mantine/core";
import { isInPopup } from '@/utils';

//import classes from '@/styles/popup/Header.module.scss';
//import popupStyles from '@/styles/popup/popup.module.scss';

import { ThemeToggle } from "@/components/ThemeToggle.tsx";

import { theme } from "@/utils/theme.ts";
import "@mantine/core/styles.css"
import { PopupHeader } from "@/components/PopupHeader.tsx";
import { useToggle } from "@mantine/hooks";
/**
 * The popup component.
 * This component will display either a login or the GoToSheet component based on the user's login status.
 * If the user is not logged in, it will display a login button.
 * If the user is logged in, it will display the GoToSheet component.
 * If the user's access token is invalid, it will exchange the refresh token for an access token.
 * If the user does not have a refresh token, it will log the user out.
 * @category Component
 * @group Popup
 * @returns the Popup component
 */
const Popup = () => {
    // create new react state for user
    const [user, setUser] = useState<UserDataType>(useUser());

    useEffect(() => {
        //to ensure that the options icon reloads when the user logs in
    }, [user]);

    return (
        <Container w="350px" p='var(--mantine-spacing-sm)'>
                <PopupHeader />
                <PopupBody />
        </Container>
    );
};

export const root = createRoot(document.getElementById("root")!);

// Check if the popup is in a popup window
const popupLocation = isInPopup()

if(popupLocation) {
    document.getElementById('root')?.classList.add('popup');
} else {
    document.getElementById('root')?.classList.add('tab');
}

root.render(
    <MantineProvider theme={theme}>
        <Popup />
    </MantineProvider>
);