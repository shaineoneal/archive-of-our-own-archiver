import { useEffect } from 'react';
import { useUser } from '@/stores';
import { ActionIcon } from '@mantine/core';
import { IconSettingsFilled } from '@tabler/icons-react';
import classes from '@/components/Popup/Header.module.css';

/**
 * Render an options icon that links to the extension options page.
 * @remarks Only renders the icon when an access token is present.
 */
export const OptionsIcon = () => {
    /** Current access token from the user store; used to toggle icon visibility. */
    const accessT = useUser().accessToken;

    useEffect(() => {
        // Debug hook to confirm token changes and re-renders.
        console.log('optionsIcon useEffect');
    }, [accessT]);

    return (
        <ActionIcon
            component="a"
            href="options.html"
            size="lg"
            variant="default"
            bd="none"
            bg="transparent"
        >
            {accessT ? <IconSettingsFilled className={classes.icon} /> : null}
        </ActionIcon>
    );
};