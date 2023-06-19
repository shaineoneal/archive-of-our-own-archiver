import { WorkStatus } from "./data"


type WorkType = {
    workId: number;
}

export class Work implements WorkType {
    workId: number;
    title: string;
    author: string[];
    fandoms: string[];
    wordCount: number;
    totalChapters: number;
    status?: WorkStatus;

    constructor(
        workId: number,
        title: string,
        author: string[],
        fandoms: string[],
        wordCount: number,
        totalChapters: number,
        status?: WorkStatus,
    ) {
        this.workId = workId;
        this.title = title;
        this.author = author;
        this.fandoms = fandoms;
        this.wordCount = wordCount;
        this.totalChapters = totalChapters;
        this.status = status;
    }

    public static getWorkFromPage(workId: number): Work {
        const workNode = document.querySelector(`#work_${workId}`);
    
        if (!workNode) {
            throw new Error(`Work ${workId} not found on page`);
        }
        const title = workNode.querySelector(".heading > a")!.textContent;
    
        const authorNodes = workNode.querySelectorAll("[rel='author']");
        const authors = Array.from(authorNodes).map((authorNode) => authorNode.textContent);
        
        const fandomNodes = workNode.querySelectorAll(".fandoms > a");
        const fandoms = Array.from(fandomNodes).map((fandomNode) => fandomNode.textContent);
        
        const wordCount = workNode.querySelector("dd.words")!.textContent;
    
        var chapterCount = workNode.querySelector("dd.chapters > a")?.textContent;
        if (!chapterCount) { //one-shot
            chapterCount = "1"; }
    
        return new this (
            workId,
            title!,
            authors as string[],
            fandoms as string[],
            parseInt(wordCount!.replace(/,/g, '')),
            parseInt(chapterCount!.replace(/,/g, '')),
        );
    }
}    
/*public static getWorkFromPage(workId: number): Work {
        const workNode = document.querySelector(`#work_${workId}`);

        if (!workNode) {
            throw new Error(`Work ${workId} not found on page`);
        }
        const title = workNode.querySelector(".heading > a").textContent;

    })*/