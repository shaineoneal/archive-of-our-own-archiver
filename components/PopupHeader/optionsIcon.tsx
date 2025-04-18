import { useEffect } from 'react';
import { IconSettingsFilled } from "@tabler/icons-react";
import { useUser } from '@/utils/zustand';
import { ActionIcon } from '@mantine/core';
import classes from '@/components/PopupHeader/PopupHeader.module.css'

/**
 * OptionsIcon component renders an icon that links to the options page.
 * It uses the user's access token to determine whether to display the icon.
 * 
 * @component
 * @example
 * return (
 *   <OptionsIcon />
 * )
 * 
 * @returns {JSX.Element} The rendered component.
 * 
 * @remarks
 * This component uses the `useUser` hook to get the access token and 
 * `useEffect` to log when the component is mounted or updated.
 * 
 * @see {@link https://reactjs.org/docs/hooks-effect.html|useEffect}
 * @see {@link https://reactjs.org/docs/hooks-reference.html#usecontext|useContext}
 */
export const OptionsIcon = () => {

    const accessT = useUser().accessToken;

    useEffect(() => {
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
            {accessT ? <IconSettingsFilled className={classes.icon}/> : null}
        </ActionIcon>
    );
}