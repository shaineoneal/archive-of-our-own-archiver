import { createRoot } from 'react-dom/client';
import { PopupBody } from '../../components/Popup/PopupBody.tsx';
import '@mantine/core/styles.css';
import { Container, LoadingOverlay, MantineProvider } from "@mantine/core";
import { useLoaderStore } from "@/stores";
import { useMounted } from "@mantine/hooks";
import { PopupHeader } from "@/components/Popup/Header.tsx";
import { theme } from "@/utils/theme.ts"

/**
 * The popup component.
 * This component will display either a login or the GoToSheetButton component based on the user's login status.
 * If the user is not logged in, it will display a login button.
 * If the user is logged in, it will display the GoToSheetButton component.
 * If the user's access token is invalid, it will exchange the refresh token for an access token.
 * If the user does not have a refresh token, it will log the user out.
 * @category Component
 * @group Popup
 * @returns the Popup component
 */
const Popup = () => {
    const { loader } = useLoaderStore();
    const mounted = useMounted();

    return (
        <Container
            fluid
            p='var(--mantine-spacing-sm)'
            className="main-popup-header responsiveContainer"
        >
            <LoadingOverlay visible={!mounted || loader} overlayProps={{ radius: 'sm', blur: 2 }}/>
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