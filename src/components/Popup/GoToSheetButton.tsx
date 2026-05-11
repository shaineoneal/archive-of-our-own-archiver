import '@mantine/core/styles.css';
import { Button, Center } from '@mantine/core';

/**
 * Render a button that opens the user's spreadsheet.
 *
 * @param spreadsheetId - The ID of the spreadsheet to open.
 * @remarks Opens a new browser tab when the button is clicked.
 */
export function GoToSheetButton({ spreadsheetId }: { spreadsheetId: string }) {
    const handleGoToSheet = async () => {
        await browser.tabs.create({ url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=0` });
    };

    return (
        <Center>
            <Button
                justify="center"
                id="sheet-button"
                onClick={handleGoToSheet}
                variant="filled"
            >
                View your sheet
            </Button>
        </Center>
    );
}