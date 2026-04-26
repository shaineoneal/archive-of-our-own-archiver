import type { WorkStatus } from "@/types/data.ts";
import type { GvizCell, GvizRow } from "@/types/gvizDataTable.ts";
import { Chapter } from "@/models/Chapter.tsx";
import { ProgressBar } from "@/components/Work/ProgressBar.tsx";

export interface HistoryEntry {
    action: string;
    date: string;
}

type SheetCell = GvizCell | null | undefined;

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
    kudos?: boolean;
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

    private static getSheetValue<T>(data: GvizRow, index: number, fallback: T): T {
        const value = (data.c?.[index] as GvizCell | undefined)?.v;
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
            kudos: data.kudos,
        };
    }

    private static parseSheetInfo(data: GvizRow): WorkInfo {
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
            kudos: this.getSheetValue(data, 17, false),
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

    static fromSheet(data: GvizRow): Work {
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
