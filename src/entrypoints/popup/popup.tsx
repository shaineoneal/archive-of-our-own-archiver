import { createRoot } from 'react-dom/client';
import { PopupBody } from '../../components/Popup/PopupBody.tsx';
import '@mantine/core/styles.css';
import { Container, LoadingOverlay, MantineProvider } from "@mantine/core";
import { useLoaderStore } from "@/stores";
import { useMounted } from "@mantine/hooks";
import { PopupHeader } from "@/components/Popup/Header.tsx";
import { theme } from "@/utils/theme.ts"

/**
 * Render the extension popup shell.
 * @remarks Shows a loading overlay while the app mounts or a background task runs.
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
            <LoadingOverlay visible={!mounted || loader} overlayProps={{ radius: 'sm', blur: 2 }} />
            <PopupHeader />
            <PopupBody />
        </Container>
    );
};

export const root = createRoot(document.getElementById("root")!);

root.render(
    <MantineProvider theme={theme}>
        <Popup/>
    </MantineProvider>
);