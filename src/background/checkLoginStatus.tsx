import { log } from "../utils/logger";
export async function checkLoginStatus() {
  try {
    const status = await fetchLoginStatus();
    return status;
  } catch (error) {
    return false;
  }
}

/**
 *
 * @returns {Promise<boolean>} of whether the user is logged in or not
 */
function fetchLoginStatus(): Promise<boolean> {
  return new Promise((resolve) => {
    chrome.storage.sync.get("isLoggedIn", (result) => {
      if (result.isLoggedIn) {
        log("logged in");
        resolve(true);
      } else {
        log("not logged in");
        resolve(false);
      }
    });
  });
}
