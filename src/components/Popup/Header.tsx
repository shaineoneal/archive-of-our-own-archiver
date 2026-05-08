import React from 'react';
import classes from '@/components/Popup/Header.module.css';
import { CloseButton, Flex, Group, ThemeIcon, Title } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { OptionsIcon, ThemeToggle } from '@/components';

/**
 * Render the popup header for the current popup view.
 *
 * @remarks
 * Reads the DOM for a `.main-popup-header` element to decide between the main
 * header layout and the options layout.
 */
export function PopupHeader() {
    const mainPage = document.querySelector('.main-popup-header');

    // Are we on the main page or the options page?
    // If we are on the main page, show logo, title, and options icon
    if (mainPage) {
        return (
            <Flex className={classes.header}>
                <Group>
                    <ThemeIcon className={classes.title}>
                        <img src="icons/icon-32.png" alt="extension-icon" />
                    </ThemeIcon>

                    <Title size="h3" ff="Georgia" className={classes.title}>AO3E: Rewritten</Title>
                </Group>
                <OptionsIcon />
            </Flex>
        );
    }
    // If we are on the options page: show back button, options title, and theme toggle
    return (
        <Flex className={classes.header}>
            <CloseButton
                className={classes.back}
                component="a"
                href="popup.html"
                icon={<IconArrowLeft />}
            />
            <div className="title">AO3E Rewritten&apos;s Options</div>
            <ThemeToggle />
        </Flex>
    );
}