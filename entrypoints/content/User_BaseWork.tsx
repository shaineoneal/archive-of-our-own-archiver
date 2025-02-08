import { WorkStatus } from "@/utils/types/data.ts";
import { BaseWork } from "./BaseWork.ts";

const defaultHistory: [HistoryEntry] = [{
    action: 'Added',
    date: new Date().toLocaleString()
}];

interface HistoryEntry {
    action: string;
    date: string;
}

export class User_BaseWork extends BaseWork {
    index: number;
    status: WorkStatus;
    history: [HistoryEntry];
    personalTags?: string[];
    rating: number;
    readCount: number;
    skipReason?: string;

    constructor(workId: number, index?: number, status?: WorkStatus, history?: [HistoryEntry], personalTags?: string[], rating?: number, readCount?: number, skipReason?: string) {
        super(workId);
        this.index = index ?? 0;
        this.status = status ?? WorkStatus.Read;
        this.history = history ?? defaultHistory;
        this.personalTags = personalTags ?? [];
        this.rating = rating ?? 0;
        this.readCount = readCount ?? 1;
        this.skipReason = skipReason ?? '';
    }

    getWork(workId: number): User_BaseWork {
        return new User_BaseWork(
            0,
            workId,
            WorkStatus.Read,
            defaultHistory,
            [],
            0,
            0,
            ''
        );

    }
    saveWorkToSession(work: User_BaseWork) {

    }
}