import { User } from '../types';
import { log } from "../utils";

export async function getSyncedUser(): Promise<User | null> {
    return new Promise((resolve) => {
        chrome.storage.sync.get(["userInfo"], async (result) => {
            log("chrome sync get result ", result);
            log("chrome sync get result userInfo ", result.userInfo);
            if (result.userInfo) {
                resolve(result.userInfo);
            } else {
                resolve(null);
            }
        });
    });
}

export async function setSyncedUser(user: User) {
    chrome.storage.sync.set({ userInfo: user });
}

export async function removeSyncedUser() {
    chrome.storage.sync.remove(["userInfo"]);
}