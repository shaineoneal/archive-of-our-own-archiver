import { useTokens } from "@/stores";
import { ActionIcon } from '@mantine/core';
import { IconSettingsFilled } from '@tabler/icons-react';
import classes from '@/components/Popup/Header.module.css';

/**
 * Render an options icon that links to the extension options page.
 * @remarks Only renders the icon when an access token is present.
 */
export const OptionsIcon = () => {
    /** Current access token from the user store; used to toggle icon visibility. */
    const { accessToken } = useTokens();

    return (
        <ActionIcon
            component="a"
            href="options.html"
            size="lg"
            variant="default"
            bd="none"
            bg="transparent"
        >
            {accessToken ? <IconSettingsFilled className={classes.icon} /> : null}
        </ActionIcon>
    );
};