import { WorkStatus } from "@/utils/types/data.ts";
import { countWords } from "@/utils/wordCounter.ts";
import { setStore } from "@/utils/browser-services";
interface HistoryEntry {
    action: string;
    date: string;
}

export class Work {
    workId: number;
    info?: {
        index?: number,
        title?: string,
        authors?: string[],
        fandoms?: string[],
        relationships?: string[],
        tags?: string[],
        description?: string,
        wordCount?: number,
        chapterCount?: number,
        status?: WorkStatus,
        history?: HistoryEntry[],
        chapters?: Chapter[],
        personalTags?: string[],
        rating?: number,
        readCount?: number,
        skipReason?: string
    };

    constructor(
        workId: number,
        info?: {
            index?: number,
            title?: string,
            authors?: string[],
            fandoms?: string[],
            relationships?: string[],
            tags?: string[],
            description?: string,
            wordCount?: number,
            chapterCount?: number,
            status?: WorkStatus,
            history?: HistoryEntry[],
            chapters?: Chapter[],
            personalTags?: string[],
            rating?: number,
            readCount?: number,
            skipReason?: string
        }
    ) {
        this.workId = workId;
        this.info = info;
    }

    static parseNumber(value: string | undefined): number {
        value = value?.replace(/,/g, "").trim();
        return parseInt(value ?? "0", 10);
    }

    static fromBlurb(workNode: Element): Work {
        const workId = parseInt(workNode.id.split("_")[1]);
        const title = workNode.querySelector(".heading > a")?.textContent ?? "";
        const authors = Array.from(workNode.querySelectorAll("[rel='author']")).map((node) => node.textContent ?? "");
        const fandoms = Array.from(workNode.querySelectorAll(".fandoms > a")).map((node) => node.textContent ?? "");
        const relationships = Array.from(workNode.querySelectorAll(".relationships > a")).map((node) => node.textContent ?? "");
        const tags = Array.from(workNode.querySelectorAll(".warnings > a, .characters > a, .freeforms > a")).map((node) => node.textContent ?? "");
        const description = workNode.querySelector(".summary > p")?.textContent ?? "";
        const wordCount = this.parseNumber(workNode.querySelector("dd.words")?.textContent ?? "");
        const chapterCount = this.parseNumber(workNode.querySelector("dd.chapters")?.textContent?.split("/")[0]);

        console.log('title', title);
        return new Work(
            workId,
            {
                title: title,
                authors: authors,
                fandoms: fandoms,
                relationships: relationships,
                tags: tags,
                description: description,
                wordCount: wordCount,
                chapterCount: chapterCount,
            }
        );
    }

    static fromUser(data: any): Work {
        return new Work(
            data.workId,
            {
                index: data.index,
                status: data.status,
                history: data.history,
                personalTags: data.personalTags,
                rating: data.rating,
                readCount: data.readCount,
                skipReason: data.skipReason,
                chapters: data.chapters
            }
        );
    }

    static fromSheet(data: any): Work {

        return new Work(
            data.c[1].v ? data.c[1].v : '',
            {
                title: data.c[2].v ? data.c[2].v : '',
                authors: data.c[3] ? data.c[3].v.split(',') : ['Anonymous'],
                fandoms: data.c[4].v ? data.c[4].v.split(',') : [],
                relationships: data.c[5].v ? data.c[5].v.split(',') : [],
                tags: data.c[6].v ? data.c[6].v.split(',') : [],
                description: data.c[7].v ? data.c[7].v : '',
                wordCount: data.c[8] ? data.c[8].v : 0,
                chapterCount: data.c[9] ? data.c[9].v : 0,
                status: data.c[10] ? data.c[10].v : 'read',
                history: data.c[11] ? data.c[11].v : '',
                chapters: data.c[12] ? data.c[12].v : [],
                personalTags: data.c[13] ? data.c[13].v.split(',') : [],
                rating: data.c[14] ? data.c[14].v : 0,
                readCount: data.c[15] ? data.c[15].v : 1,
                skipReason: data.c[16] ? data.c[16].v : undefined
            }
        );
    }

    static fromActiveWork(doc: Document): Work {
        const chapters = Chapter.parseChapterInfo(doc);
        const workId = doc.querySelector('.download ul a')?.getAttribute('href')?.split('/')[2];
        console.log('workId', workId);
        if (!workId) {
            throw new Error('Work ID not found');
        }
        return new Work(
            this.parseNumber(workId),
            {
                chapters: chapters
            }
        );
    }

    sumPreviousChapters(currentChap: number): number {
        if (currentChap === 1) {
            return 0;
        }
        const previousChapters = this.info?.chapters?.slice(0, currentChap - 1);
        console.log("previousChapters", previousChapters);

        if (!previousChapters) {
            return 0;
        }
        let totalWordCount = 0;
        for (const chapter of previousChapters) {
            console.log("chapter", chapter);
            totalWordCount += chapter.wordCount;
        }
        console.log("cnt", totalWordCount);
        return totalWordCount;
    }

    createProgressBar(activeChap: Chapter): React.ReactNode {
        let prevCount = this.sumPreviousChapters(activeChap.chapterNumber);
        console.log(prevCount);
        const totalWordCount = this.info?.chapters?.reduce((sum, chapter) => sum + chapter.wordCount, 0) ?? 0;
        return <ProgressBar current={prevCount} total={totalWordCount} thisChap={activeChap?.wordCount ?? 0} />;
    }
}

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
        console.log('chapterList:', chapterList);
        return chapterList;
    }


}
// Extracted ProgressBar component
// @ts-ignore
const ProgressBar: React.FC<{ current: number; total: number; thisChap: number; }> = ({ current, total, thisChap }) => {

    const progressPercent = (current / total) * 100;
    const currentPercent = ((thisChap / total) * 100) + progressPercent;

    return (
        <div>
            <div className="progress-bar">
                <div className='progress current-progress' style={{ width: `${currentPercent}%`}}>
                    <span className="tooltip">
                        {thisChap} words
                    </span>
                </div>
                <div className='progress read-progress' style={{ width: `${progressPercent}%` }}>
                    <span className="tooltip">
                        {current} words
                    </span>
                </div>

            </div>
            <span>
                {current} / {total}
            </span>
        </div>
    );
}