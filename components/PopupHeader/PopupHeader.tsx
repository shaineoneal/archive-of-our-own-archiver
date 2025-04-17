import { CloseButton, Flex, Group, ThemeIcon, Title } from "@mantine/core";
import { OptionsIcon } from "@/components/optionsIcon.tsx";
import classes from '@/components/PopupHeader/PopupHeader.module.css';
import { IconArrowLeft } from "@tabler/icons-react";
import React from "react";

export function PopupHeader() {

    const mainPage = document.querySelector('.main-popup-header');
    console.log('page: ', mainPage);
    if (!mainPage) {
        return (
            <Flex className={classes.header} >
                <CloseButton
                    className={classes.back}
                    component="a"
                    href="popup.html"
                    icon={<IconArrowLeft />}
                />
                <div className="title">AO3E Rewritten&apos;s Options</div>
                <ThemeToggle />
            </Flex>
        )
    }
    return (
        <Flex className={classes.header} >
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