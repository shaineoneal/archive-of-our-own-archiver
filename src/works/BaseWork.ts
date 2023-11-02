import { WorkStatus } from '../data';

interface IBaseWork {
    workId: number;
    title: string;
    authors: string[];
    fandoms: string[];
    relationships: string[];
    tags: string[];
    description: string;
    wordCount: number;
    totalChapters: number;
    status: WorkStatus;
    rating: number;
    reads?: Date[];
}


export class BaseWork implements IBaseWork {
    workId: number;
    title: string;
    authors: string[];
    fandoms: string[];
    relationships: string[];
    tags: string[];
    description: string;
    wordCount: number;
    totalChapters: number;
    status: WorkStatus;
    rating: number;
    reads?: Date[];


    constructor(
        workId: number,
        title: string,
        authors: string[],
        fandoms: string[],
        relationships: string[],
        tags: string[],
        description: string,
        wordCount: number,
        totalChapters: number,
        status: WorkStatus,
        rating: number,
        reads?: Date[]
    ) {
        this.workId = workId;
        this.title = title;
        this.authors = authors;
        this.fandoms = fandoms;
        this.relationships = relationships;
        this.tags = tags;
        this.description = description;
        this.wordCount = wordCount;
        this.totalChapters = totalChapters;
        this.status = status;
        this.rating = rating;
        this.reads = reads;
    }

    public toString(): string {
        return JSON.stringify(this);
    }

    public markWorkAsSeen() {
        this.status = 'read' as WorkStatus
    }
 
}

