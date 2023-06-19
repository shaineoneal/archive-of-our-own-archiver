import { log } from "../utils/logger";

/**
 * 
 * @param token user's auth token
 * @returns promise of the sheet URL
 */
export function fetchSheetURL(token: string) {
    log("getting sheet URL");
    return new Promise<string>((resolve, reject) => {
        //check for a stored sheet URL
        chrome.storage.sync.get(["sheetURL"], async(result) => {
            
            const sheetURL = result.sheetURL;
            //does the user have a sheet URL already?
            if (sheetURL) {
                log("user has sheet URL: ", sheetURL);
                log("sheetID: ", sheetURL.split("/")[5]);
                resolve(sheetURL);
            } else {
                log("user doesn't have sheet URL, creating sheet");
                try {
                    const createdSheetURL = await createSheet(token);
                    resolve(createdSheetURL);
                } catch (error) {
                    reject(error);
                }
            }
        });
    });
}

export function fetchSheetID(token: string) {
    log("getting sheet ID");
    return new Promise<string>((resolve, reject) => {
        chrome.storage.sync.get(["sheetID"], async(result) => {
            const sheetID = result.sheetID;
            if (sheetID) {
                log("user has sheet ID: ", sheetID);
                resolve(sheetID);
            } else {
                log("user doesn't have sheet ID, creating sheet");
                //try {
                //    const createdSheetID = await createSheet(token);
                //    resolve(createdSheetID);
                //} catch (error) {
                //    reject(error);
                //}
            }
        });
    });
}

export const sheetURL = async (token: string) => {
    await fetchSheetURL(token);
}

/**
 * 
 * @param token user's auth token
 * @returns 
 */
async function createSheet(token: string) {
    const url = "https://sheets.googleapis.com/v4/spreadsheets";
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
            properties: {
              title: "AO3E",
            },
        }),
    };
  
    return fetch(url, options)
        .then((response) => {
            log("Response status:", response.status);
            return response.json();
        })
        .then((data) => {
            log("Success:", data);
            chrome.storage.sync.set({ sheetURL: data.spreadsheetUrl });
            chrome.storage.sync.set({ sheetID: data.spreadsheetId });
            return data.spreadsheetUrl;
        })
        .catch((error) => {
            error("Error creating sheet:", error);
            throw error;
        });
}
