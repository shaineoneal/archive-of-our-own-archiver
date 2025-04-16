import { chromeLaunchWebAuthFlow, createSpreadsheet, requestAuthorization, revokeTokens } from '@/utils/browser-services';
import { useActions, useLoaderStore, useUser } from '@/utils/zustand';
import { sendMessage } from '@/utils/browser-services/messaging';
import { Button, Center, Text } from "@mantine/core";


/**
 * Component for the login functionality.
 * Allows users to log in to Google and obtain an access token.
 * The component displays a login button and a loader while the authentication flow is in progress.
 * @component
 * @group Popup
 * @returns the LoginButton component 
 */
export const Login = () => {
    const { loader, setLoader } = useLoaderStore();
    const { userStoreLogin, setSpreadsheetId } = useActions();
    const spreadsheetId = useUser().spreadsheetId;

    // TODO: set up full user store on login

    /**
     * Handles the login functionality.
     * Launches the web authentication flow with interactive set to true.
     * Requests authorization and sets the access token in the local storage and user store.
     * Set the spreadsheet URL in the sync storage.
     */
    const handleLogin = async () => {
        setLoader(true);    //show loader

        try {
            await sendMessage('Login', undefined);
        } catch (error) {
            console.log('Error in handleLogin: ', error);
        } finally {
            setLoader(false);   //hide loader
        }
    };

    return (
        <>
            <Text size="xl" fw={500} ta="center" p={15}>Please log in to begin</Text>
            <Center>
                <Button
                    id="login-button"
                    onClick={ handleLogin }
                    disabled={ loader }
                    justify="center"
                >
                    Login to Google
                </Button>
            </Center>
        </>
    );
};