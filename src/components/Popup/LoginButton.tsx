import { Button, Center, Text } from '@mantine/core';
import { sendMessage } from '@/services';
import { useLoaderStore } from '@/stores';

/**
 * Render a login button that starts the Google auth flow.
 * @remarks Displays a loader state while the login message is in flight.
 */
export const LoginButton = () => {
    const { loader, setLoader } = useLoaderStore();

    /**
     * Start the login flow and toggle loader state.
     * @returns A promise that resolves when the login attempt finishes.
     */
    const handleLoginPress = async () => {
        setLoader(true);

        try {
            await sendMessage('Login', undefined);
        } catch (error) {
            logger.error('Error in handleLogin: ', error);
        } finally {
            setLoader(false);
        }
    };

    return (
        <>
            <Text size="xl" fw={500} ta="center" p={15}>Please log in to begin</Text>
            <Center>
                <Button
                    id="login-button"
                    onClick={handleLoginPress}
                    disabled={loader}
                >
                    Login to Google
                </Button>
            </Center>
        </>
    );
};