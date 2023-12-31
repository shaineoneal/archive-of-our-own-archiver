export const WORK_STATUSES = [
    '' /* default */,
    'reading',
    'toRead',
    'onHold',
    'dropped',
    'read',
    'skipped',
] as const;

export type WorkStatus = (typeof WORK_STATUSES)[number];
