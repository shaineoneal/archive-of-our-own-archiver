import { Button, Center } from '@mantine/core'
import '@mantine/core/styles.css'

/**
 * Component that displays a button to go to the user's sheet.
 * @param props.spreadsheetId The id of the spreadsheet to go to.
 * @returns A button that when clicked will go to the user's sheet.
 */
export const GoToSheetButton = (props: { spreadsheetId: string }) => {
    const handleGoToSheet = () => {
        browser.tabs.create({ url: `https://docs.google.com/spreadsheets/d/${props.spreadsheetId}/edit#gid=0` });
    };

    return (
        <Center>
            <Button justify="center" id="sheet-button" onClick={handleGoToSheet} variant="filled">
                View your sheet
            </Button>
        </Center>
    );
};
