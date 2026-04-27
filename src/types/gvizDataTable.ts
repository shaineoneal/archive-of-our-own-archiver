export type GvizColumnType =
    | 'string'
    | 'number'
    | 'boolean'
    | 'date'
    | 'datetime'
    | 'timeofday';

export type GvizCellValue = string | number | boolean | null;

export interface GvizCell {
    v?: GvizCellValue;
    f?: string | null;      //string version of v
    p?: Record<string, unknown>;    //map of cell properties
}

export interface GvizRow {
    c: GvizCell[];
}

export interface GvizColumn {
    id: string;
    label: string;
    type: GvizColumnType | string;
    pattern?: string;
}

export interface GvizDataTable {
    cols: GvizColumn[];
    rows: GvizRow[];
    parsedNumHeaders?: number;
}

export interface GvizQueryError {
    reason?: string;
    message?: string;
    detailed_message?: string;
}

export interface GvizDataTableResponse {
    version: string;
    reqId: string;
    status: 'ok' | 'error';
    sig?: string;
    table?: GvizDataTable;
    errors?: GvizQueryError[];
}
