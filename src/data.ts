export const WORK_STATUSES = [
    'reading',
    'toRead',
    'onHold',
    'dropped',
    'read'
] as const;

export type WorkStatus = typeof WORK_STATUSES[number];