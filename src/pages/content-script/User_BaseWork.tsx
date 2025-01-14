import { WORK_STATUSES, WorkStatus } from "../../utils/types/data";
import { Ao3_BaseWork } from "./Ao3_BaseWork";
import { BaseWork } from "./BaseWork";
import { querySpreadsheet } from "../../utils/chrome-services";

export class User_BaseWork extends BaseWork {
    index: number;
    status: WorkStatus;
    history: string;        //TODO: change to array of updates
    personalTags?: string[];
    rating: number;
    readCount: number;
    skipReason?: string;

    constructor(index: number, workId: number, status: WorkStatus, history: string, personalTags: string[], rating: number, readCount: number, skipReason: string) {
        super(workId);
        this.index = index ?? 0;
        this.status = status ?? WORK_STATUSES["read"];
        this.history = history ?? '';
        this.personalTags = personalTags ?? [];
        this.rating = rating ?? 0;
        this.readCount = readCount ?? 1;
        this.skipReason = skipReason ?? '';
    }

    getWork(workId: number): User_BaseWork {
        return new User_BaseWork(
            0,
            workId,
            WORK_STATUSES["read"],
            '',
            [],
            0,
            0,
            ''
        );

    }
    saveWorkToSession(work: User_BaseWork) {

    }
}