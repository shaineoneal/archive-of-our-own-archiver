import { useEffect, useState } from "react";

//return token fix??
export function getSheetURL(token: string) {
    console.log("getting sheet URL");
    return new Promise<string>((resolve, reject) => {
        chrome.storage.sync.get(["sheetURL"], async(result) => {
            const sheetURL = result.sheetURL;
            //does the user have a sheet URL?
            if (sheetURL) {
                console.log("user has sheet URL");
                resolve(sheetURL);
            } else {
                console.log("user doesn't have sheet URL, creating sheet");
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


export async function getURL() {
    console.log("getURL");
    let url: string = "";
    try {
        chrome.storage.sync.get(["sheetURL"], (result) => {
            console.log("getURL", result.sheetURL)
            return result.sheetURL;
        });
    } catch (error) {  
        console.log("Error in getURL:", chrome.runtime.lastError);
        chrome.identity.clearAllCachedAuthTokens(() => {
            console.log("Cleared all cached");
        });
    }
    return url;
}

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
        console.log("Response status:", response.status);
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        chrome.storage.sync.set({ sheetURL: data.spreadsheetUrl });
        return data.spreadsheetUrl;
      })
      .catch((error) => {
        console.error("Error creating sheet:", error);
        throw error;
      });
}



export default async function useSheetURL(token: string) {
    const [sheetURL, setSheetURL] = useState("");

    useEffect(() => {
        
        async function fetchSheetURL() {
            try {
                const url = await getSheetURL(token);
                setSheetURL(url);
            } catch (error) {
                console.log("error getting sheet URL", error);
                chrome.identity.clearAllCachedAuthTokens(() => {
                    console.log("Cleared all cached");
                });
            }
        }
        
        fetchSheetURL();
       
    }, [sheetURL]);


}