import React, { useEffect } from 'react';
import { SyncUserStore, useActions } from '@/stores';
import { LogoutButton } from '@/components/Popup/LogoutButton.tsx';
import { NewSheetButton } from '@/components/Popup/NewSheetButton.tsx';
import { root } from "@/entrypoints/popup/popup.tsx";
import '@mantine/core/styles.css';
import { theme } from "@/utils/theme.ts";
import { PopupHeader } from "@/components/Popup/Header.tsx";
import { Container, Flex, Input, MantineProvider, Paper, Title } from '@mantine/core';

export function openOptionsPage() {
    chrome.runtime.openOptionsPage();
}

/**
 * The main component for the options page.
 * @returns the Options component
 */
const Options = () => {

    let { setSpreadsheetId } = useActions();
    let { spreadsheetId } = SyncUserStore.getState().user;
    let spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;

    useEffect(() => {
        spreadsheetId = SyncUserStore.getState().user.spreadsheetId;
    }, [spreadsheetId]);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const regex = /^https:\/\/docs\.google\.com\/spreadsheets\/d\/([A-Za-z0-9_-]+)(\/|$)/;

        const match = event.target.value.match(regex);
        logger.debug('match: ', match);
        if(match && match[1]) {
            const spreadsheetId = match[1];
            logger.debug('new spreadsheetId: ', spreadsheetId);
            setSpreadsheetId(spreadsheetId);
            //TODO: set spreadsheetId
        } else {
            //TODO: handle invalid url
        }

    };

    //TODO: evaluate if this is needed
    //chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //    console.log('heard message: ', message);
    //    if (message.message === 'spreadsheetUrlChanged') {
    //        setSpreadsheetUrl(message.newUrl);
    //        setLoader(false);
    //    }
    //});

    return (
        <Container w="350px" p='var(--mantine-spacing-sm)'>
            <PopupHeader/>
            <main>
                <Paper shadow="xs" p="md" mb="md" withBorder>
                    <Flex direction="column"
                          justify="space-between"
                          gap="xs"
                    >
                        <Title size="h4">Google Spreadsheets URL</Title>
                        <Input
                            type="text"
                            defaultValue={spreadsheetUrl}
                            onChange={onChange}
                        />
                        <NewSheetButton/>
                    </Flex>
                </Paper>
                <Paper shadow="xs" p="md" withBorder>
                    <LogoutButton/>
                </Paper>

            </main>
        </Container>
    );
};

root.render(
    <MantineProvider theme={theme}>
        <Options/>
    </MantineProvider>
);