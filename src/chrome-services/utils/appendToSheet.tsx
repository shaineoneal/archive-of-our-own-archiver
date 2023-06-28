import { log } from "../../utils/logger";
import { Work } from "../../works";

export function addWorkToSheet(work: Work) {
    log("addWorkToSheet", work);

    const sheetID = localStorage.getItem("sheetID");
    if (!sheetID) {
        log("addWorkToSheet", "sheetID not found");
        return;
    }
    const sheetName = 'Sheet1';
    const auth = localStorage.getItem("auth");



    return fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}:append?valueInputOption=USER_ENTERED`, 
    {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth
        },
        body: work.createJSON(),
    }).then((response) => { response.json() })
}
