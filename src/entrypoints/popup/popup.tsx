import { PopupBody, PopupHeader } from '@/components';
import '@mantine/core/styles.css';
import { exchangeRefreshForAccessToken, isAccessTokenValid } from "@/services";
import { getAndSetTokens, hydrateSpreadsheetId, setTokens, useLoaderStore, useTokens } from "@/stores";
import { theme } from "@/utils/theme.ts"
import { Container, LoadingOverlay, MantineProvider } from "@mantine/core";
import { useMounted } from "@mantine/hooks";
import { useEffect } from "react";
import { createRoot } from 'react-dom/client';

/**
 * Render the extension popup shell.
 * @remarks Shows a loading overlay while the app mounts or a background task runs.
 */
const Popup = () => {
    const { loader, setLoader } = useLoaderStore();
    const mounted = useMounted();
    const { accessToken, refreshToken } = useTokens();

    useEffect(() => {
        (async () => {
            if (!accessToken) {
                logger.debug('No access token found in state on popup load, checking storage for tokens');
                const { accessToken: aT } = await getAndSetTokens();
                if (!aT) {
                    logger.debug('No access token found in storage on popup load, user is not logged in');
                    setLoader(false);
                }
            } else {
                logger.debug('Access found in state on popup load, validating token');
                try {
                    // if accessToken is invalid
                    if (!await isAccessTokenValid(accessToken)) {
                        logger.debug('Access token is invalid. Attempting to refresh token');

                        try {
                            // Exchange refresh token for access token.
                            const newAccessToken = await exchangeRefreshForAccessToken(refreshToken);
                            if (!newAccessToken) {
                                logger.debug('Token exchange did not return a new access token, logging out user');
                            } else {
                                await setTokens({ accessToken: newAccessToken, refreshToken: refreshToken });
                            }
                        } catch (e) {
                            logger.error('Error exchanging refresh token for access token', e);
                        }
                    } else {
                        logger.debug('User has a valid access token');
                        await hydrateSpreadsheetId();
                    }
                } catch (e) {
                    logger.error('Error loading popup auth state', e);
                }
            }
            setLoader(false);
        })();
    }, [accessToken]);

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

const rootElement = document.getElementById('root');

if (!rootElement) {
    logger.error('Popup root element not found');
} else {
    const root = createRoot(rootElement);

    root.render(
        <MantineProvider theme={theme}>
            <Popup />
        </MantineProvider>
    );
}