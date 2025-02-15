import { defineExtensionMessaging } from "@webext-core/messaging";
import { Ao3_BaseWork, User_BaseWork } from "@/entrypoints/content";

interface ProtocolMap {
    addWorkToSpreadsheet(work: Ao3_BaseWork): User_BaseWork;
    checkLogin(): boolean;
    loggedIn(data: { accessToken: string, refreshToken: string }): void;
    querySpreadSheet(searchList: number[]): boolean[];
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();