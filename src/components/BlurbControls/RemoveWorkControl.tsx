import { Work } from '@/models';
import { useBlurbWorkId, useWork } from '@/stores';
import React from 'react';

/**
 * Render a control that removes the current work from the shelf.
 *
 * @remarks
 * - Prevents default anchor navigation on click.
 * - Logs and exits early when the work cannot be found in the store.
 * - Spreadsheet removal messaging is currently stubbed/commented.
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

                // sendMessage(
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
                // );
            }}
        >
            remove
        </a>
    );
}