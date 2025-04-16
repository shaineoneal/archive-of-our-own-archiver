import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { IconArrowLeft } from "@tabler/icons-react";
import '../../styles.scss';
import { SyncUserStore, useActions } from '@/utils/zustand';
import { Logout, NewSheet } from './';
import { CloseButton, Container, Flex, MantineProvider, Paper } from "@mantine/core";
import '@mantine/core/styles.css';
import { theme } from "@/utils/theme.ts";
import { PopupHeader } from "@/components/PopupHeader.tsx";

export function openOptionsPage() {
    chrome.runtime.openOptionsPage();
}

/**
 * The main component for the options page.
 * @returns the Options component
 */
const Options =  () => {

    let { setSpreadsheetId } = useActions();
    let { spreadsheetId } = SyncUserStore.getState().user;
    let spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;

    useEffect(() => {
        spreadsheetId = SyncUserStore.getState().user.spreadsheetId;
    }, [spreadsheetId]);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const regex = /^https:\/\/docs\.google\.com\/spreadsheets\/d\/([A-Za-z0-9_-]+)(\/|$)/;

        const match = event.target.value.match(regex);
        console.log('match: ', match);
        if(match && match[1]) {
            const spreadsheetId = match[1];
            console.log('new spreadsheetId: ', spreadsheetId);
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
                    <div>Google Spreadsheets URL</div>
                    <input 
                        type="text" 
                        defaultValue={spreadsheetUrl}
                        onChange={onChange}
                    />
                    <NewSheet/>
                </Paper>
            <Paper shadow="xs" p="md" withBorder>
                <Logout/>
            </Paper>

            </main>
        </Container>
    );
};

export const root = createRoot(document.getElementById("root")!);

root.render(
    <MantineProvider theme={theme}>
    <Options />
    </MantineProvider>
);