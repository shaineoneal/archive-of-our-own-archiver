import { WorkStatus } from '../../utils/types/data';

type BaseWorkType = {
    workId: number;
};

export class BaseWork implements BaseWorkType {
    workId: number;
    title: string;
    author: string[];
    fandoms: string[];
    relationships: string[];
    tags: string[];
    description: string;
    wordCount: number;
    totalChapters: number;
    status: WorkStatus;
    rating: number;
    rereadCount?: number;


    constructor(
        workId: number,
        title: string,
        author: string[],
        fandoms: string[],
        relationships: string[],
        tags: string[],
        description: string,
        wordCount: number,
        totalChapters: number,
        status: WorkStatus,
        rating: number,
        rereadCount?: number
    ) {
        this.workId = workId;
        this.title = title;
        this.author = author;
        this.fandoms = fandoms;
        this.relationships = relationships;
        this.tags = tags;
        this.description = description;
        this.wordCount = wordCount;
        this.totalChapters = totalChapters;
        this.status = status;
        this.rating = rating;
        this.rereadCount = rereadCount;
    }

    public toString(): string {
        return JSON.stringify(this);
    }
 
}

