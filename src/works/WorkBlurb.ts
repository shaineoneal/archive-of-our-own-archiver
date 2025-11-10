<<<<<<<< HEAD:src/works/WorkBlurb.ts
import { BaseWork } from "./BaseWork";

export class WorkBlurb extends BaseWork {
    static getWorkFromPage(workId: number): BaseWork {
        const workNode = document.querySelector(`#work_${workId}`);

        if (!workNode) {
            throw new Error(`Work ${workId} not found on page`);
        }
        const title = workNode.querySelector('.heading > a')!.textContent;

        const authorNodes = workNode.querySelectorAll("[rel='author']");
        const authors = Array.from(authorNodes).map(
            (authorNode) => authorNode.textContent
        );

        const fandomNodes = workNode.querySelectorAll('.fandoms > a');
        const fandoms = Array.from(fandomNodes).map(
            (fandomNode) => fandomNode.textContent
        );

        const relationships = ['placeholder'];

        const tags = ['placeholder'];

        const description = 'longer placeholder';

        const wordCount = workNode.querySelector('dd.words')!.textContent;

        var chapterCount =
            workNode.querySelector('dd.chapters > a')?.textContent;
        if (!chapterCount) {
            //one-shot
            chapterCount = '1';
        }

        return new this(
            workId,
            title!,
            authors as string[],
            fandoms as string[],
            relationships,
            tags,
            description,
            parseInt(wordCount!.replace(/,/g, '')),
            parseInt(chapterCount!.replace(/,/g, '')),
            "",
            0,
            0
        );
========
import { Work } from "./Work.tsx";

export class Ao3_BaseWork extends Work {
    title: string;
    authors: string[];
    fandoms: string[];
    relationships: string[];
    tags: string[];
    description: string;
    wordCount: number;
    chapterCount: number;

    constructor(workId: number, title: string, authors: string[], fandoms: string[], relationships: string[], tags: string[], description: string, wordCount: number, chapterCount: number) {
        super(workId);
        this.title = title;
        this.authors = authors;
        this.fandoms = fandoms;
        this.relationships = relationships;
        this.tags = tags;
        this.description = description;
        this.wordCount = wordCount;
        this.chapterCount = chapterCount;
>>>>>>>> 1692b6678568874e76be9dbba32dc05b16b0bb1d:src/Ao3_BaseWork.ts
    }

    static createWork(workNode: Element | null) {
        if (!workNode) {
            throw new Error(`Work not found on page`);
        }

<<<<<<<< HEAD:src/works/WorkBlurb.ts
        const workId = parseInt(workNode.id.split('_')[1]);
========
        let workId;

        if(workNode.id) {
            workId = parseInt(workNode.id.split('_')[1]);
        }
        else {
            const workIdNode = workNode.querySelector(`.status-read`);
            if (!workIdNode) {
                throw new Error(`Work not found on page`);
            }
            workId = parseInt(workIdNode.id.split('_')[1]);
        }
>>>>>>>> 1692b6678568874e76be9dbba32dc05b16b0bb1d:src/Ao3_BaseWork.ts

        const title = workNode.querySelector('.heading > a')!.textContent;

        const authorNodes = workNode.querySelectorAll("[rel='author']");
        const authors = Array.from(authorNodes).map(
            (authorNode) => authorNode.textContent
        );

        const fandomNodes = workNode.querySelectorAll('.fandoms > a');
        const fandoms = Array.from(fandomNodes).map(
            (fandomNode) => fandomNode.textContent
        );

        const relationshipNodes = workNode.querySelectorAll('.relationships > a');
        const relationships = Array.from(relationshipNodes).map(
            (relationshipNode) => relationshipNode.textContent
        );

        const tagNodes = workNode.querySelectorAll('.warnings > a, .characters > a, .freeforms > a');
        const tags = Array.from(tagNodes).map(
            (tagNode) => tagNode.textContent
        );

        const description = workNode.querySelector('.summary > p')!.textContent;

        const wordCount = workNode.querySelector('dd.words')!.textContent;

        var chapterCount =
            workNode.querySelector('dd.chapters > a')?.textContent;
        if (!chapterCount) {
            //one-shot
            chapterCount = '1';
        }

        return new this(
            workId,
            title!,
            authors as string[],
            fandoms as string[],
            relationships as string[],
            tags as string[],
            description!,
            parseInt(wordCount!.replace(/,/g, '')),
            parseInt(chapterCount!.replace(/,/g, '')),
            "",
            0,
            0
        );
    }

}