import { WorkStatus } from "@/types/data.ts";
import type { GvizCell, GvizRow } from "@/types/gvizDataTable.ts";
import { Chapter } from "@/models/Chapter.tsx";
import { ProgressBar } from "@/components/Work/ProgressBar.tsx";
import { SheetColumnOrder } from "@/models/sheet.ts";
import React from "react";
import { normalizeWorkId, parseJson, parseList } from "@/utils";

export interface HistoryEntry {
    action: string;
    date: string;
}

export type WorkInfo = {
    index: number;
    title: string;
    authors: string[];
    fandoms: string[];
    relationships: string[];
    tags: string[];
    description: string;
    wordCount: number;
    chapterCount: number;
    status: WorkStatus;
    history: HistoryEntry[];
    chapters: Chapter[];
    personalTags: string[];
    rating: number;
    readCount: number;
    skipReason: string;
    kudos: boolean;
}

const sheetIndex = Object.fromEntries(SheetColumnOrder.map((key, index) => [key, index]));

export class Work {
    workId: string;
    info: WorkInfo;

    constructor(
        workId: string,
        info: WorkInfo | Partial<WorkInfo>
    ) {
        this.workId = workId;
        this.info = {
            ...DEFAULT_WORK_INFO,
            ...info,
        };
    }

    static rehydrateWork = (workLike: Work): Work => {
        return new Work(workLike.workId, workLike.info);
    }

    static fromRow(row: GvizRow): Work {
        return new Work(
            normalizeWorkId(this.getSheetValue(row, sheetIndex.workId)),
            {
                index: this.getSheetValue(row, sheetIndex.index, 0),
                title: this.getSheetValue(row, sheetIndex.title, ""),
                authors: parseList(this.getSheetValue(row, sheetIndex.authors, ""), ", "),
                fandoms: parseList(this.getSheetValue(row, sheetIndex.fandoms, ""), ", "),
                relationships: parseList(this.getSheetValue(row, sheetIndex.relationships, ""), ", "),
                tags: parseList(this.getSheetValue(row, sheetIndex.tags, ""), ", "),
                description: this.getSheetValue(row, sheetIndex.description, ""),
                wordCount: this.getSheetValue(row, sheetIndex.wordCount, 0),
                chapterCount: this.getSheetValue(row, sheetIndex.chapterCount, 0),
                status: this.getSheetValue(row, sheetIndex.status, "read") as WorkStatus,
                history: parseJson<HistoryEntry[]>(this.getSheetValue(row, sheetIndex.history, "[]"), []),
                chapters: parseJson<Chapter[]>(this.getSheetValue(row, sheetIndex.chapters, "[]"), []),
                personalTags: parseList(this.getSheetValue(row, sheetIndex.personalTags, ""), ", "),
                rating: this.getSheetValue(row, sheetIndex.rating, 0),
                readCount: this.getSheetValue(row, sheetIndex.readCount, 0),
                skipReason: this.getSheetValue(row, sheetIndex.skipReason, ""),
                kudos: this.getSheetValue(row, sheetIndex.kudos, false),
            }
        );
    }

    static parseNumber(value: string | undefined): number {
        value = value?.replace(/,/g, "").trim();
        return parseInt(value ?? "0", 10);
    }

    private static parseTextList(workNode: Element, selector: string): string[] {
        return Array.from(workNode.querySelectorAll(selector)).map((node) => node.textContent ?? "");
    }


    /**
     * Retrieve a typed value from a Gviz row cell, with a fallback when empty.
     *
     * @typeParam T - Expected type of the cell value.
     * @param data - The Gviz row containing cell data.
     * @param index - Column index to read from.
     * @param fallback - Value returned when the cell is null or undefined.
     * @returns The cell value cast to T, or the fallback.
     */
    private static getSheetValue<T>(data: GvizRow, index: number, fallback?: T): T {
        const value = (data.c?.[index] as GvizCell | undefined)?.v;
        return (value !== undefined && value !== null) ? (value as T) : (fallback as T);
    }

    private static parseBlurbInfo(workNode: Element): WorkInfo {
        const title = workNode.querySelector(".heading > a")?.textContent ?? "";

        return {
            ...DEFAULT_WORK_INFO,
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

    private getChapterList(): Chapter[] {
        return Array.isArray(this.info?.chapters) ? this.info.chapters : [];
    }

    static fromBlurb(workNode: Element): Work {
        const workId = parseInt(workNode.id.split("_")[1]);
        const info = this.parseBlurbInfo(workNode);

        logger.debug("title", info.title);
        return new Work(workId.toString(), info);
    }

    static fromActiveWork(doc: Document): Work {
        const chapters = Chapter.parseChapterInfo(doc);
        const workId = doc.querySelector('.download ul a')?.getAttribute('href')?.split('/')[2];
        logger.debug('workId', workId);
        if (!workId) {
            throw new Error('Work ID not found');
        }
        return new Work(
            workId,
            {
                ...DEFAULT_WORK_INFO,
                chapters: chapters
            }
        );
    }

    addHistory(historyAction: string) {
        const date = new Date();
        const sheetDate = date.toLocaleString(undefined, { timeZoneName: "shortOffset" });

        const newHistory = {
            action: historyAction,
            date: sheetDate,
        };

        this.info.history = this.info.history.concat(newHistory);

        if (historyAction === "fullWorkAdded") {
            this.info.readCount += 1;
        }
    }
    sumPreviousChapters(currentChap: number): number {
        if (currentChap === 1) {
            return 0;
        }
        const previousChapters = this.getChapterList().slice(0, currentChap - 1);
        logger.debug("previousChapters", previousChapters);

        let totalWordCount = 0;
        for (const chapter of previousChapters) {
            logger.debug("chapter", chapter);
            totalWordCount += chapter.wordCount;
        }
        logger.debug("cnt", totalWordCount);
        return totalWordCount;
    }

    toStringArray(): string[] {
        return [
            this.info.index.toString(),
            this.workId.toString(),
            this.info.title,
            this.info.authors.join(", "),
            this.info.fandoms.join(", "),
            this.info.relationships.join(", "),
            this.info.tags.join(", "),
            this.info.description,
            this.info.wordCount.toString(),
            this.info.chapterCount.toString(),
            this.info.status,
            JSON.stringify(this.info.history),
            JSON.stringify(this.info.chapters),
            this.info.personalTags.join(", "),
            this.info.rating.toString(),
            this.info.readCount.toString(),
            this.info.skipReason,
            this.info.kudos.toString()
        ]
    }

    createProgressBar(activeChap: Chapter): React.ReactNode {
        const prevCount = this.sumPreviousChapters(activeChap.chapterNumber);
        const totalWordCount = this.getChapterList().reduce((sum, chapter) => sum + chapter.wordCount, 0);
        return <ProgressBar current={prevCount} total={totalWordCount} thisChap={activeChap?.wordCount ?? 0} />;
    }
}

const DEFAULT_WORK_INFO: WorkInfo = {
    // @ts-ignore
    index: '=ROW(INDIRECT("R[0]C[1]", FALSE))',
    title: "",
    authors: [],
    fandoms: [],
    relationships: [],
    tags: [],
    description: "",
    wordCount: 0,
    chapterCount: 0,
    status: WorkStatus.Read,
    history: [],
    chapters: [],
    personalTags: [],
    rating: 0,
    readCount: 0,
    skipReason: "",
    kudos: false,
};