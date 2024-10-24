import { RowData } from "./RowData";

type AppendCellsRequest = {
    "sheetId": number;
    "rows": RowData[];
    "fields": string;
};