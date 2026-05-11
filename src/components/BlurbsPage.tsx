import { sendMessage } from '@/services';
import { logger } from '@/utils';

/**
 * Scrape work IDs from standard blurb listings and request background updates.
 *
 * @remarks
 * - Queries `li.work.blurb` elements in the DOM
 * - Logs IDs, and sends a
 * `QuerySpreadSheet` message to the background script when any IDs are found.
 *
 * @returns A promise that resolves when the background message is sent or when no IDs are found.
 * @category Components
 */
export async function standardBlurbsPage() {
    // 1. Scrape the page for Work IDs
    const workIdsOnPage = Array.from(document.querySelectorAll('li.work.blurb'))
        .map(el => el.id.split('_')[1]);

    // 2. Ask the background script to query only these IDs
    if (workIdsOnPage.length > 0) {
        logger.debug('workIdsOnPage: ', workIdsOnPage);
        try {
            await sendMessage('QuerySpreadSheet', workIdsOnPage);
        } catch (error) {
            logger.error(error);
        }
    }
}