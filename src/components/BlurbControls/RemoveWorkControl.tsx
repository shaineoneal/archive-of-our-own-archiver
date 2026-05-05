import { Work } from "@/models";
import { useBlurbWorkId, useWork } from "@/stores";
import React from "react";

/**
 * Control for removing a work from the spreadsheet/shelf.
 * @returns Anchor control component.
 * @remarks Spreadsheet removal message is currently stubbed/commented.
 */
export function RemoveWorkControl() {
    const workId = useBlurbWorkId();
    const work = useWork(workId);
    return (
        <a
            className="toggle"
            onClick={(e) => {
                e.preventDefault();

                logger.debug('removeWork clicked!: ', work);

                if (!work) {
                    logger.error('removeWork clicked but no work was found in ShelfStore for workId: ', workId);
                    return;
                }

                const workBlurb = new Work(workId, work.info);
                logger.debug('workBlurb.workId: ', workBlurb);

                //sendMessage(
                //    MessageName.RemoveWorkFromSheet,
                //    { workId: workBlurb.workId },
                //    (response: MessageResponse<boolean>) => {
                //        if (response.error) {
                //            logger.debug('removeWork error: ', response.error);
                //        } else {
                //            logger.debug('content script response: ', response.response);
                //            changeBlurbStyle(WorkStatus.Default, workWrap);
                //        }
                //    }
                //);
            }}
        >
            remove
        </a>
    );
}