import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { PopupBody } from './main/popup_body.tsx';
import { UserDataType, useUser } from '@/utils/zustand';
import { OptionsIcon } from './main/optionsIcon.tsx';
import { createTheme, MantineColorsTuple, MantineProvider, Container, AppShell, Flex, ActionIcon } from "@mantine/core";
import { isInPopup } from '@/utils';
import classes from '@/styles/popup/Header.module.scss';
import popupStyles from '@/styles/popup/popup.module.scss';
import '@mantine/core/styles.css'
import { mantineTheme } from "@/utils/theme.ts";
import { ThemeToggle } from "@/entrypoints/popup/components/ThemeToggle.tsx";

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
        <AppShell className={popupStyles.popup}>
            <AppShell.Header className={classes.header}>
                <Flex
                    align="flex"
                    className={classes.inner}
                >
                    <ActionIcon className="logo">
                        <img src="icons/icon-32.png" alt="extension-icon" />
                    </ActionIcon>
                    <div className="title">AO3E: Rewritten</div>
                    <OptionsIcon />
                    <ThemeToggle />
                </Flex>
            </AppShell.Header>
            <AppShell.Main>
                <PopupBody />
            </AppShell.Main>
        </AppShell>
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
    <MantineProvider theme={mantineTheme}>
        <Popup />
    </MantineProvider>
);