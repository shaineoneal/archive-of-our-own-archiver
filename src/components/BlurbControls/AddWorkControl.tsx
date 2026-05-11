import { Work } from '@/models';
import { sendMessage } from '@/services';
import { useBlurbTargetBlurb, useBlurbWorkId } from '@/stores';

/**
 * Renders an "Add" control that persists the current blurb to the spreadsheet/shelf.
 *
 * @remarks
 * - Reads the current work id and blurb from stores.
 * - Builds a {@link Work} from the blurb, then sends it to the background via `sendMessage`.
 * - Logs a warning if the background does not return a saved work.
 */
export function AddWorkControl() {
    const workId = useBlurbWorkId();
    const targetBlurb = useBlurbTargetBlurb();

    return (
        <li>
            <input
                type="submit"
                value="Add"
                className="ao4-toggle"
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
            </input>
        </li>
    );
}