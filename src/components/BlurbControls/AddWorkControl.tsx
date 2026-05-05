/**
 * @packageDocumentation
 * @module BlurbControls
 */

import React from "react";
import { Work } from "@/models";
import { sendMessage } from "@/services";
import { useBlurbTargetBlurb, useBlurbWorkId } from "@/stores";

/**
 * Control for adding a work to the spreadsheet/shelf.
 * @returns Anchor control component.
 * @category Component
 */
export function AddWorkControl() {
    const workId = useBlurbWorkId();
    const targetBlurb = useBlurbTargetBlurb();

    return (
        <a
            className="toggle"
            onClick={(e) => {
                e.preventDefault();

                logger.debug('addWork clicked!: ', workId);

                const work = Work.fromBlurb(targetBlurb);
                logger.debug('workBlurb: ', work);

                sendMessage('AddWorkToSpreadsheet', work).then((savedWork) => {
                    logger.debug('addWork response: ', savedWork);

                    if (!savedWork) {
                        logger.error('addWork did not return a work');
                        return;
                    }
                });
            }}
        >
            Add
        </a>
    );
}