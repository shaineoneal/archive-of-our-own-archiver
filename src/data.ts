export const WORK_STATUSES = [
    'reading',
    'toRead',
    'onHold',
    'dropped',
    'read',
    '' /* default */,
] as const;

export type WorkStatus = (typeof WORK_STATUSES)[number];
