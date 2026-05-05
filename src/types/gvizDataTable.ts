/**
 * Allowed column types supported by Google Visualization DataTable.
 */
export type GvizColumnType =
    | 'string'
    | 'number'
    | 'boolean'
    | 'date'
    | 'datetime'
    | 'timeofday';

/**
 * Allowed value types for a single cell.
 */
export type GvizCellValue = string | number | boolean | null;

/**
 * A single cell in a Gviz row.
 */
export interface GvizCell {
    /** Raw value for the cell. */
    v?: GvizCellValue;
    /** Formatted string version of the value. */
    f?: string | null;      //string version of v
    /** Arbitrary cell-level properties. */
    p?: Record<string, unknown>;    //map of cell properties
}

/**
 * A single row in the table.
 */
export interface GvizRow {
    /** Ordered list of cells corresponding to table columns. */
    c: GvizCell[];
}

/**
 * A column definition in the table schema.
 */
export interface GvizColumn {
    /** Column identifier. */
    id: string;
    /** Human-friendly column label. */
    label: string;
    /** Data type of the column. */
    type: GvizColumnType | string;
    /** Optional format pattern for the column. */
    pattern?: string;
}

/**
 * A full Google Visualization DataTable structure.
 */
export interface GvizDataTable {
    /** Column definitions. */
    cols: GvizColumn[];
    /** Row data. */
    rows: GvizRow[];
    /** Number of header rows parsed by the API. */
    parsedNumHeaders?: number;
}

/**
 * Error payload from a query response.
 */
export interface GvizQueryError {
    /** Short error reason. */
    reason?: string;
    /** Human-readable error message. */
    message?: string;
    /** Detailed error description if available. */
    detailed_message?: string;
}

/**
 * Top-level response wrapper for a Gviz query.
 */
export interface GvizDataTableResponse {
    /** API response version. */
    version: string;
    /** Request identifier. */
    reqId: string;
    /** Response status. */
    status: 'ok' | 'error';
    /** Optional response signature. */
    sig?: string;
    /** Data table when status is ok. */
    table?: GvizDataTable;
    /** Errors when status is error. */
    errors?: GvizQueryError[];
}