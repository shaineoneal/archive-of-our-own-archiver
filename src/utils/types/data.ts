export const WORK_STATUSES = [
    'reading',
    'toRead',
    'skipped',
    'dropped',
    'read',
    '' /* default */,
] as const;

export type WorkStatus = (typeof WORK_STATUSES)[number];
