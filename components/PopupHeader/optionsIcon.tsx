import { useEffect } from 'react';
import { IconSettingsFilled } from "@tabler/icons-react";
import { useUser } from '@/utils/zustand';
import { ActionIcon } from '@mantine/core';
import classes from '@/components/modules/PopupHeader.module.css'

/**
 * Renders an icon that links to the options page if the user has an access token.
 *
 * @component
 * @example <OptionsIcon />
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @remarks
 * Uses the `useUser` hook to access the user’s access token.
 *
 * @see {@link https://reactjs.org/docs/hooks-effect.html|useEffect}
 */
export const OptionsIcon = () => {

    const accessT = useUser().accessToken;

    useEffect(() => {
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
            {accessT ? <IconSettingsFilled className={classes.icon}/> : null}
        </ActionIcon>
    );
}