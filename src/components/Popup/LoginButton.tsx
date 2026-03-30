import { useLoaderStore, useUser } from '@/stores';
import { sendMessage } from "@/services";
import { Button, Center, Text } from '@mantine/core';

/**
 * Component for the login functionality.
 * Allows users to log in to Google and obtain an access token.
 * The component displays a login button and a loader while the authentication flow is in progress.
 * @component
 * @group Popup
 * @returns the LoginButton component 
 */
export const LoginButton = () => {
    const { loader, setLoader } = useLoaderStore();
    const spreadsheetId = useUser().spreadsheetId;

    // TODO: set up full user store on login

    /**
     * calls {@link handleLogin} to initiate the login process.
     */
    const handleLoginPress = async () => {
        setLoader(true);    //show loader

        try {
            await sendMessage('Login', undefined);
        } catch (error) {
            logger.error('Error in handleLogin: ', error);
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
                    onClick={ handleLoginPress }
                    disabled={ loader }
                >
                    Login to Google
                </Button>
            </Center>
        </>
    );
};