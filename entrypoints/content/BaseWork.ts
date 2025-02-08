import { Ao3_BaseWork } from "./Ao3_BaseWork.ts";
import { User_BaseWork } from "./User_BaseWork.tsx";
import { WorkStatus } from "@/utils/types/data.ts";

export abstract class BaseWork {
    workId: number;

    protected constructor(workId: number) {
        this.workId = workId;
    }

    abstract getWork(workId: number): Ao3_BaseWork | User_BaseWork;
}