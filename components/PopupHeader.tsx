import { Flex, Group, ThemeIcon, Title } from "@mantine/core";
import { OptionsIcon } from "@/components/optionsIcon.tsx";
import classes from '@/components/modules/PopupHeader.module.css';

export function PopupHeader() {
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