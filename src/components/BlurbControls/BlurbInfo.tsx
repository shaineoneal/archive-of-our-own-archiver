/**
 * @packageDocumentation
 * @module BlurbControls
 */
import React from "react";
import { useBlurbWorkId, useWork } from "@/stores";
import { formatDate } from "@/utils";

/**
 * Displays read metadata for the current work when available.
 * @returns Last-read and read-count information block.
 * @component
 */
export function BlurbInfo() {
    const work = useWork(useBlurbWorkId());
    const date = work?.info.history.length
        ? new Date(work.info.history[work.info.history.length - 1].date)
        : undefined;

    return (
        <>
            {work ? (
                <div className="blurb-info">
                    <p className={'last-read datetime'}>
                        Last read: {date ? formatDate(date) : 'N/A'}
                    </p>
                    <p className={'read-count datetime'}>
                        Read {work ? work.info.readCount : 0} time(s)
                    </p>
                </div>
            ) : null}
        </>
    );
}