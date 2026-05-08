import { createSpreadsheet } from '@/services';
import { useLoaderStore, UserStore } from '@/stores';
import { Button, Flex } from '@mantine/core';

/**
 * Render a button that creates a new Google Sheet.
 * @remarks Shows a loader while the spreadsheet is created and stores the ID.
 */
export const NewSheetButton = () => {
    const { loader, setLoader } = useLoaderStore();
    let { accessToken, spreadsheetId } = UserStore.getState().user;
    const setSpreadsheetId = UserStore.getState().actions.setSpreadsheetId;

    if (accessToken === undefined) {
        return null;
    }

    const handleNewSheet = async () => {
        setLoader(true);
        const id = await createSpreadsheet(accessToken);
        if (id) {
            setSpreadsheetId(id);
        }
        setLoader(false);
    };

    return (
        <Flex justify="end" align="center">
            <Button
                onClick={handleNewSheet}
                variant="light"
            >
                New Sheet
            </Button>
        </Flex>
    );
};
