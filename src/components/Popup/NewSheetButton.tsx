import { createSpreadsheet } from '@/services';
import { getAndSetTokens, setSpreadsheetId, useLoaderStore } from '@/stores';
import { Button, Flex } from '@mantine/core';

/**
 * Render a button that creates a new Google Sheet.
 * @remarks Shows a loader while the spreadsheet is created and stores the ID.
 */
export const NewSheetButton = () => {
    const { setLoader } = useLoaderStore();

    const handleNewSheet = async () => {
        let { accessToken } = await getAndSetTokens();
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
