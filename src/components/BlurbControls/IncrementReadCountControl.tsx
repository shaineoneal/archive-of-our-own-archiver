import React from "react";
import { sendMessage } from "@/services";
import { useBlurbWorkId, useWork } from "@/stores";

/**
 * Control that increments a work's read count/history and syncs it.
 * @returns Anchor control component.
 */
export function IncrementReadCountControl() {
    const workId = useBlurbWorkId();
    const work = useWork(workId);

    return (
        <a
            className="toggle"
            onClick={(e) => {
                e.preventDefault();

                logger.debug('incrementReadCount clicked!: ', work);

                if (!work) {
                    logger.error('incrementReadCount clicked but no work was found in ShelfStore for workId: ', workId);
                    return;
                }

                work.addHistory("fullWorkAdded");
                const history = work.info.history;
                history.push({
                    action: "reread",
                    date: new Date().toLocaleString(),
                });

                logger.debug('hist', work);

                sendMessage('UpdateWorkInSpreadsheet', work).then((response) => {
                    if (!response) {
                        logger.error('incrementReadCount error');
                    } else {
                        logger.debug('incrementReadCount complete');
                    }
                    return;
                });

            }}
        >
            +1
        </a>
    );
}