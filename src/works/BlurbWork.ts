import { WorkStatus } from "../data";
import { log } from "../utils";
import { BaseWork } from "./BaseWork";

//if work on page is listed as work NOT bookmark
export class BlurbWork extends BaseWork {

    constructor () {
        super(0, '', [], [], [], [], '', 0, 0, '', 0);
    }

    static getWorkFromBlurb(workNode: Element | null, status: WorkStatus) {

        log('creating work from node', workNode);

        if (!workNode) {
            throw new Error(`Work not found on page`);
        }

        const workId = parseInt(workNode.id.split('_')[1]);

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

        const descriptionNodes = workNode.querySelectorAll('.summary > p') as NodeListOf<HTMLElement>;
        const description = Array.from(descriptionNodes)
            .map((node) => node.textContent)
            .join('\n');

        const wordCount = workNode.querySelector('dd.words')!.textContent;

        var chapterCount =
            workNode.querySelector('dd.chapters > a')?.textContent;
        if (!chapterCount) {
            //one-shot
            chapterCount = '1';
        }

        return new BaseWork(
            workId,
            title!,
            authors as string[],
            fandoms as string[],
            relationships as string[],
            tags as string[],
            description,
            parseInt(wordCount!),
            parseInt(chapterCount),
            status,
            0
        );
    }

}