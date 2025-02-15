import { defineExtensionMessaging } from "@webext-core/messaging";
import { Ao3_BaseWork, User_BaseWork } from "@/entrypoints/content";

interface ProtocolMap {
    AddWorkToSpreadsheet(work: Ao3_BaseWork): User_BaseWork;
    CheckLogin(): boolean;
    LoggedIn(data: { accessToken: string, refreshToken: string }): void;
    QuerySpreadSheet(searchList: number[]): boolean[];
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();

