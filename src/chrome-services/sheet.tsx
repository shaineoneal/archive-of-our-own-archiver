import { log } from "../utils";

/**
 *
 * @param token user's auth token
 * @returns promise of the sheet URL
 */
export function fetchSheetURL(token: string) {
    log("getting sheet URL");
    return new Promise<string>((resolve, reject) => {
        //check for a stored sheet URL
        chrome.storage.sync.get(["userInfo"], async (result) => {
            const sheetUrl = result.userInfo?.sheetUrl;
            //does the user have a sheet URL already?
            if (sheetUrl !== undefined) {
                log("user has sheet URL: ", sheetUrl);
                log("sheetID: ", sheetUrl.split("/")[5]);
                resolve(sheetUrl);
            } else {
                log("user doesn't have sheet URL, creating sheet");
                await createSheet(token).then((url) => {
                    resolve(url);
                }).catch((error) => {
                    reject(error);
                });
            }
        });
  });
}


/**
 *
 * @param token user's auth token
 * @returns
 */
async function createSheet(token: string) {
  const title = "AO3E";
  const sheetName = "Saved Works";

  const sheetLayout = {
    properties: { title: title },
    sheets: {
      properties: { title: sheetName },
      data: [
        {
          startRow: 0,
          startColumn: 0,
          rowData: [
            {
              values: [
                {
                  userEnteredValue: { stringValue: "Work ID" },
                  userEnteredFormat: { textFormat: { bold: true } },
                },
                {
                  userEnteredValue: { stringValue: "Title" },
                  userEnteredFormat: { textFormat: { bold: true } },
                },
                {
                  userEnteredValue: { stringValue: "Authors" },
                  userEnteredFormat: { textFormat: { bold: true } },
                },
                {
                  userEnteredValue: { stringValue: "Fandoms" },
                  userEnteredFormat: { textFormat: { bold: true } },
                },
                {
                  userEnteredValue: { stringValue: "Word Count" },
                  userEnteredFormat: { textFormat: { bold: true } },
                },
                {
                  userEnteredValue: { stringValue: "Chapter Count" },
                  userEnteredFormat: { textFormat: { bold: true } },
                },
                {
                  userEnteredValue: { stringValue: "Status" },
                  userEnteredFormat: { textFormat: { bold: true } },
                },
              ],
            },
          ],
        },
        { startColumn: 0, columnMetadata: { pixelSize: 100 } }, //work ID
        { startColumn: 1, columnMetadata: { pixelSize: 300 } }, //title
        { startColumn: 2, columnMetadata: { pixelSize: 200 } }, //authors
        { startColumn: 3, columnMetadata: { pixelSize: 200 } }, //fandoms
        { startColumn: 4, columnMetadata: { pixelSize: 100 } }, //word count
        { startColumn: 5, columnMetadata: { pixelSize: 100 } }, //chapter count
        { startColumn: 6, columnMetadata: { pixelSize: 100 } }, //status
      ],
    },
  };

  const url = "https://sheets.googleapis.com/v4/spreadsheets";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(sheetLayout),
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
