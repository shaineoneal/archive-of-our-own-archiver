import { Work } from '@/services';
import { Spreadsheet } from "@/models/sheet.ts";

/**
 * Adds a work entry to a Google Sheets spreadsheet.
 *
 * Calls `addHistory` on the work, appends the row values to the sheet,
 * and returns a `Work` instance created from the append response.
 *
 * @param ss - Spreadsheet instance used to append values.
 * @param authToken - OAuth token for Google Sheets API.
 * @param work - Work entry to append.
 * @returns A promise that resolves to the appended Work.
 * @throws If the append response is missing `updates` or the API call fails.
 */
export const addWorkToSheet = async (
    ss: Spreadsheet,
    authToken: string,
    work: Work
): Promise<Work> => {
    // Add a history entry to the work
    work.addHistory("fullWorkAdded");

    try {
        const response = await ss.appendWorkValues(authToken, work.toStringArray());

        // Ensure the API response includes updates before mapping to Work
        if (response && response.updates) {
            return Work.fromAppendResponse(response.updates);
        }

        throw new Error("Missing updates in response.");
    } catch (error) {
        // Log and rethrow so callers can handle the failure.
        console.error("Error appending work to sheet:", error);
        throw error;
    }
};