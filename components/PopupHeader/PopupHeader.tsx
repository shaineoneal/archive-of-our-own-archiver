import { CloseButton, Flex, Group, ThemeIcon, Title } from "@mantine/core";
import { OptionsIcon } from "@/components/PopupHeader/optionsIcon.tsx";
import classes from '@/components/modules/PopupHeader.module.css';
import { IconArrowLeft } from "@tabler/icons-react";
import React from "react";
import { ThemeToggle } from "@/components/PopupHeader/ThemeToggle.tsx";

/**
 * Renders the header for the popup, displaying different content for the main and options pages.
 *
 * @component
 * @example <PopupHeader />
 *
 * @returns {JSX.Element} The rendered header component.
 *
 * @remarks
 * Determines the current page by querying the document for the ".main-popup-header" class.
 * Shows the logo, title, and options icon on the main page, or a back button, options title, and theme toggle on the options page.
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
                        <img src="icons/icon-32.png" alt="extension-icon"/>
                    </ThemeIcon>

                    <Title size="h3" ff="Georgia" className={classes.title}>AO3E: Rewritten</Title>
                </Group>
                <OptionsIcon/>
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
                icon={<IconArrowLeft/>}
            />
            <div className="title">AO3E Rewritten&apos;s Options</div>
            <ThemeToggle/>
        </Flex>
    )
}