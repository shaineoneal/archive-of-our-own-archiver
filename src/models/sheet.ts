type ValueRange = {
    "range": string,
    "majorDimension": "ROWS" | "COLUMNS",
    "values": Array<string>
}

export type AppendWorkResponse = {
    "spreadsheetId": string,
    "updatedRange": string,
    "updatedRows": number,
    "updatedColumns": number,
    "updatedCells": number,
    "updatedData": ValueRange
}

export const SheetColumnOrder = [
    "index",
    "workId",
    "title",
    "authors",
    "fandoms",
    "relationships",
    "tags",
    "description",
    "wordCount",
    "chapterCount",
    "status",
    "history",
    "chapters",
    "personalTags",
    "rating",
    "readCount",
    "skipReason",
    "kudos",
] as const;

export type SheetColumnKey = typeof SheetColumnOrder[number];


export class Spreadsheet {
    spreadsheetId: string;
    mainSheetName: string;

    constructor(spreadsheetId: string) {
        this.spreadsheetId = spreadsheetId;
        this.mainSheetName = "AccessWorks";
    }

    async appendWorkValues(authToken: string, values: string[]): Promise<any> {
        const resp = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${this.mainSheetName}!A1:append?valueInputOption=USER_ENTERED&includeValuesInResponse=true`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    range: `${this.mainSheetName}!A1`,
                    majorDimension: 'ROWS',
                    values: [values]
                })
            }
        )
        return resp.json();
    }
}