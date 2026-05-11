import { PopupHeader } from "@/components/Popup/Header.tsx";
import { LogoutButton } from '@/components/Popup/LogoutButton.tsx';
import { NewSheetButton } from '@/components/Popup/NewSheetButton.tsx';
import '@mantine/core/styles.css';
import { setSpreadsheetId, useSpreadsheetId } from '@/stores';
import { theme } from "@/utils/theme.ts";
import { Container, Flex, Input, MantineProvider, Paper, Title } from '@mantine/core';
import React from 'react';
import { createRoot } from "react-dom/client";

export function openOptionsPage() {
    chrome.runtime.openOptionsPage();
}

/**
 * The main component for the options page.
 * @returns the Options component
 */
const Options = () => {
    const [ errorStatus, setErrorStatus ] = useState(false);
    const spreadsheetId = useSpreadsheetId();
    let spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;

    /**
     * Parse a spreadsheet URL and store the extracted spreadsheet ID.
     * @param event - Text input change event.
     * @returns Nothing.
     */
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const regex = /^https:\/\/docs\.google\.com\/spreadsheets\/\/?u?\/?[0-9]?\/?d\/([A-Za-z0-9_-]+)(\/|$)/;

        const match = event.target.value.match(regex);
        logger.debug('match: ', match);
        if (match && match[1]) {
            const spreadsheetId = match[1];
            logger.debug('new spreadsheetId: ', spreadsheetId);
            setSpreadsheetId(spreadsheetId);
            setErrorStatus(false);
            // TODO: actually check if the user can access it properly
        } else {
            // TODO: handle invalid url
            setErrorStatus(true);
        }

    };

    // TODO: evaluate if this is needed
    // chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //    console.log('heard message: ', message);
    //    if (message.message === 'spreadsheetUrlChanged') {
    //        setSpreadsheetUrl(message.newUrl);
    //        setLoader(false);
    //    }
    // });

    return (
        <Container fluid p='var(--mantine-spacing-sm)' className="responsiveContainer">
            <PopupHeader/>
            <main>
                <Paper shadow="xs" p="md" mb="md" withBorder>
                    <Flex
                        direction="column"
                        justify="space-between"
                        gap="xs"
                    >
                        <Title size="h4">Google Spreadsheets URL</Title>
                        <Input
                            type="text"
                            defaultValue={spreadsheetUrl}
                            onChange={onChange}
                            error={errorStatus ? 'Please enter a valid Google Spreadsheet URL' : false}
                        />
                        <NewSheetButton />
                    </Flex>
                </Paper>
                <Paper shadow="xs" p="md" withBorder>
                    <LogoutButton />
                </Paper>

            </main>
        </Container>
    );
};

const rootElement = document.getElementById('root');

if (!rootElement) {
    logger.error('Options root element not found');
} else {
    const root = createRoot(rootElement);

    root.render(
        <MantineProvider theme={theme}>
            <Options />
        </MantineProvider>
    );
}