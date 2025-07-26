import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { PopupBody } from './main/PopupBody.tsx';
import { useLoaderStore, useUser } from '@/utils/zustand';
import { Container, LoadingOverlay, MantineProvider } from "@mantine/core";
import { isInPopup } from '@/utils';
import { theme } from "@/utils/theme.ts";
import "@mantine/core/styles.css"
import { PopupHeader } from "@/components/PopupHeader/PopupHeader.tsx";
import { useMounted } from "@mantine/hooks";

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
    const user = useUser();
    const { loader } = useLoaderStore();
    const mounted = useMounted();
    console.log('mounted: ', mounted);
    // Check if the popup is in a popup window
    const popupLocation = isInPopup()

    useEffect(() => {
        //to ensure that the options icon reloads when the user logs in
    }, [user]);

    return (
        <Container
            w={isInPopup() ? "350px" : "100%"}
            p='var(--mantine-spacing-sm)'
            className="main-popup-header"
        >
            <LoadingOverlay visible={!mounted && !loader} overlayProps={{ radius: 'sm', blur: 2 }}/>
            <PopupHeader/>
            <PopupBody/>
        </Container>
    );
};

export const root = createRoot(document.getElementById("root")!);

root.render(
    <MantineProvider theme={theme}>
        <Popup/>
    </MantineProvider>
);