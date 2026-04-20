import type { WorkStatus } from "@/types/data.ts";

export interface HistoryEntry {
    action: string;
    date: string;
}

type SheetCell = { v?: unknown } | null | undefined;

interface SheetRow {
    c?: SheetCell[];
}

export interface WorkInfo {
    index?: number;
    title?: string;
    authors?: string[];
    fandoms?: string[];
    relationships?: string[];
    tags?: string[];
    description?: string;
    wordCount?: number;
    chapterCount?: number;
    status?: WorkStatus | string;
    history?: HistoryEntry[] | string;
    chapters?: Chapter[] | string;
    personalTags?: string[];
    rating?: number;
    readCount?: number;
    skipReason?: string;
}

export class Work {
    workId: number;
    info?: WorkInfo;

    constructor(
        workId: number,
        info?: WorkInfo
    ) {
        this.workId = workId;
        this.info = info;
    }

    static parseNumber(value: string | undefined): number {
        value = value?.replace(/,/g, "").trim();
        return parseInt(value ?? "0", 10);
    }

    private static parseTextList(workNode: Element, selector: string): string[] {
        return Array.from(workNode.querySelectorAll(selector)).map((node) => node.textContent ?? "");
    }

    private static splitSheetList(value: unknown, fallback: string[] = []): string[] {
        return typeof value === "string" && value ? value.split(",") : fallback;
    }

    private static getSheetValue<T>(data: SheetRow, index: number, fallback: T): T {
        const value = (data.c?.[index] as { v?: unknown } | undefined)?.v;
        return (value ? value : fallback) as T;
    }

    private static parseBlurbInfo(workNode: Element): WorkInfo {
        const title = workNode.querySelector(".heading > a")?.textContent ?? "";

        return {
            title,
            authors: this.parseTextList(workNode, "[rel='author']"),
            fandoms: this.parseTextList(workNode, ".fandoms > a"),
            relationships: this.parseTextList(workNode, ".relationships > a"),
            tags: this.parseTextList(workNode, ".warnings > a, .characters > a, .freeforms > a"),
            description: workNode.querySelector(".summary > p")?.textContent ?? "",
            wordCount: this.parseNumber(workNode.querySelector("dd.words")?.textContent ?? ""),
            chapterCount: this.parseNumber(workNode.querySelector("dd.chapters")?.textContent?.split("/")[0]),
        };
    }

    private static parseUserInfo(data: any): WorkInfo {
        return {
            index: data.index,
            status: data.status,
            history: data.history,
            personalTags: data.personalTags,
            rating: data.rating,
            readCount: data.readCount,
            skipReason: data.skipReason,
            chapters: data.chapters,
        };
    }

    private static parseSheetInfo(data: SheetRow): WorkInfo {
        return {
            index: this.getSheetValue(data, 0, 0),
            title: this.getSheetValue(data, 2, ""),
            authors: this.splitSheetList(this.getSheetValue(data, 3, ""), ["Anonymous"]),
            fandoms: this.splitSheetList(this.getSheetValue(data, 4, ""), []),
            relationships: this.splitSheetList(this.getSheetValue(data, 5, ""), []),
            tags: this.splitSheetList(this.getSheetValue(data, 6, ""), []),
            description: this.getSheetValue(data, 7, ""),
            wordCount: this.getSheetValue(data, 8, 0),
            chapterCount: this.getSheetValue(data, 9, 0),
            status: this.getSheetValue(data, 10, "read"),
            history: this.getSheetValue(data, 11, ""),
            chapters: this.getSheetValue(data, 12, []),
            personalTags: this.splitSheetList(this.getSheetValue(data, 13, ""), []),
            rating: this.getSheetValue(data, 14, 0),
            readCount: this.getSheetValue(data, 15, 1),
            skipReason: this.getSheetValue(data, 16, undefined),
        };
    }

    private getChapterList(): Chapter[] {
        return Array.isArray(this.info?.chapters) ? this.info.chapters : [];
    }

    static fromBlurb(workNode: Element): Work {
        const workId = parseInt(workNode.id.split("_")[1]);
        const info = this.parseBlurbInfo(workNode);

        logger.debug("title", info.title);
        return new Work(workId, info);
    }

    static fromUser(data: any): Work {
        return new Work(data.workId, this.parseUserInfo(data));
    }

    static fromSheet(data: any): Work {
        const workId = this.getSheetValue(data, 1, "");
        return new Work(this.parseNumber(String(workId)), this.parseSheetInfo(data));
    }

    static fromActiveWork(doc: Document): Work {
        const chapters = Chapter.parseChapterInfo(doc);
        const workId = doc.querySelector('.download ul a')?.getAttribute('href')?.split('/')[2];
        logger.debug('workId', workId);
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
        const previousChapters = this.getChapterList().slice(0, currentChap - 1);
        logger.debug("previousChapters", previousChapters);

        if (!previousChapters) {
            return 0;
        }
        let totalWordCount = 0;
        for (const chapter of previousChapters) {
            logger.debug("chapter", chapter);
            totalWordCount += chapter.wordCount;
        }
        logger.debug("cnt", totalWordCount);
        return totalWordCount;
    }

    createProgressBar(activeChap: Chapter): React.ReactNode {
        let prevCount = this.sumPreviousChapters(activeChap.chapterNumber);
        logger.debug(prevCount);
        const totalWordCount = this.getChapterList().reduce((sum, chapter) => sum + chapter.wordCount, 0);
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
        logger.debug('chapterList:', chapterList);
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