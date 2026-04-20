import { Work } from "@/models/work.tsx";

export class Chapter {
    chapterId: number;
    title: string;
    wordCount: number;
    chapterNumber: number;
    status: string;

    constructor(
        chapterId: number,
        title: string,
        wordCount: number,
        chapterNumber: number,
        status: string
    ) {
        this.chapterId = chapterId;
        this.title = title;
        this.wordCount = wordCount;
        this.chapterNumber = chapterNumber;
        this.status = status;
    }

    static getChapter(): Chapter {
        const chapterNode = document.querySelector(".chapter .chapter");
        if (!chapterNode) throw new Error("Chapter not found on page");

        const urlMatch = chapterNode.ownerDocument.location.href.match(/\/works\/(\d+)\/chapters\/(\d+)/);
        if (!urlMatch) throw new Error("Invalid URL format");
        const chapterId = parseInt(urlMatch[2], 10);

        const chapInfo = chapterNode.querySelector("h3.title")?.textContent?.trim();
        const chapTitleMatch = chapInfo?.match(/Chapter (\d+): (.+)/);
        const chapterNumber = Work.parseNumber(chapTitleMatch?.[1]);
        const title = chapTitleMatch?.[2] ?? "No title";

        const chapText = document.querySelectorAll("#chapters div.userstuff p");
        const chapWordCount = Array.from(chapText).reduce(
            (count, paragraph) => count + countWords(paragraph.textContent ?? ""),
            0
        );

        return new Chapter(chapterId, title, chapWordCount, chapterNumber, "unread");
    }

    static chapterFromNode(chapterNode: Element): Chapter {
        const chapterId = chapterNode.querySelector("h3.title a")?.getAttribute("href")?.split("/").pop() ?? "";
        const title = chapterNode.querySelector("h3.title")?.textContent?.trim() ?? "";
        const chapterNumber = parseInt(chapterNode.id.split("-")[1]) || 0;
        const status = chapterNode.querySelector("dd.status")?.textContent ?? "unread";

        let chapText = chapterNode.querySelectorAll('div.userstuff p');

        const chapWordCount = Array.from(chapText).reduce(
            (count, paragraph) => count + countWords(paragraph.textContent ?? ""),
            0
        );

        return new Chapter(parseInt(chapterId), title, chapWordCount, chapterNumber, status);
    }

    static parseChapterInfo(doc: Document): Chapter[] {
        const chapters = doc.querySelectorAll("#chapters > .chapter");
        const chapterList: Chapter[] = [];
        for (let i = 0; i < chapters.length; i++) {
            const work = Chapter.chapterFromNode(chapters[i]);
            chapterList.push(work);
        }
        logger.debug('chapterList:', chapterList);
        return chapterList;
    }


}