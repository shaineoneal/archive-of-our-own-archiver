import { log } from "../../utils";

/**
 *
 * @returns {Promise<boolean>} of whether the user is logged in or not
 */
export async function checkLoginStatus() {
    try {
        const status = await fetchLoginStatus();
        return status;
    } catch (error) {
        return false;
    }
}

function fetchLoginStatus(): Promise<boolean> {
    return new Promise((resolve) => {
        chrome.storage.sync.get("userInfo", (result) => {
            if (result.userInfo?.authToken !== undefined) {
                log("logged in");
                resolve(true);
            } else {
                log("not logged in");
                resolve(false);
            }
        });
    });
}
