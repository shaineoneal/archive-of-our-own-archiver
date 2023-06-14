
export function checkLoginStatus() {
  return new Promise<boolean>((resolve) => {
    chrome.storage.sync.get(["token"], (result) => {
        if (result.token) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
  });
}