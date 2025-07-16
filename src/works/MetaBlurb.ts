import { BaseWork } from "./BaseWork";

export class metaBlurb extends BaseWork {
    static getWorkFromMeta(): BaseWork {
        const metaBlurb = document.querySelector('.work.meta.group')
        if (!metaBlurb) {
            throw new Error('Work not found on page');
        }
        const workId = parseInt(location.href.split('/')[4], 10);

        const title = document.querySelector('.title.heading')!.textContent;

        const authorNodes = document.querySelectorAll("[rel='author']");
        const authors = Array.from(authorNodes).map(
            (authorNode) => authorNode.textContent
        );

        const fandomNodes = document.querySelectorAll('.fandom.tags > ul > li > a.tag');
        const fandoms = Array.from(fandomNodes).map(
            (fandomNode) => fandomNode.textContent
        );

        const relationshipNodes = document.querySelectorAll('.relationships.tags > ul > li > a.tag');
        const relationships = Array.from(relationshipNodes).map(
            (relationshipNode) => relationshipNode.textContent
        );

        const tagNodes = document.querySelectorAll('.freeform.tags > ul > li > a.tag');
        const tags = Array.from(tagNodes).map(
            (tagNode) => tagNode.textContent
        );

        const description = document.querySelector('.summary.module > blockquote')!.textContent;

        const wordCount = metaBlurb.querySelector('dd.words')!.textContent;

        var chapterCount =
            metaBlurb.querySelector('dd.chapters')?.textContent;
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
            description as string,
            parseInt(wordCount!.replace(/,/g, '')),
            parseInt(chapterCount!.replace(/,/g, '')),
            "",
            0,
            0
        );
    }

    static createWork(metaBlurb: Element | null) {
        if (!metaBlurb) {
            throw new Error(`Work not found on page`);
        }

        const workId = parseInt(metaBlurb.id.split('_')[1]);

        const title = metaBlurb.querySelector('.heading > a')!.textContent;

        const authorNodes = metaBlurb.querySelectorAll("[rel='author']");
        const authors = Array.from(authorNodes).map(
            (authorNode) => authorNode.textContent
        );

        const fandomNodes = metaBlurb.querySelectorAll('.fandoms > a');
        const fandoms = Array.from(fandomNodes).map(
            (fandomNode) => fandomNode.textContent
        );

        const relationshipNodes = metaBlurb.querySelectorAll('.relationships > a');
        const relationships = Array.from(relationshipNodes).map(
            (relationshipNode) => relationshipNode.textContent
        );

        const tagNodes = metaBlurb.querySelectorAll('.warnings > a, .characters > a, .freeforms > a');
        const tags = Array.from(tagNodes).map(
            (tagNode) => tagNode.textContent
        );

        const description = metaBlurb.querySelector('.summary > p')!.textContent;

        const wordCount = metaBlurb.querySelector('dd.words')!.textContent;

        var chapterCount =
            metaBlurb.querySelector('dd.chapters > a')?.textContent;
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