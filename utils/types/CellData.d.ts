type ExtendedValue = 

    // Union field value can be only one of the following:
    { "numberValue"?: number } | 
    { "stringValue"?: string } | 
    { "boolValue"?: boolean } | 
    { "formulaValue"?: string } | 
    { "errorValue"?: 
        { "type": string } 
    };

type CellData = ExtendedValue;

export type { CellData };