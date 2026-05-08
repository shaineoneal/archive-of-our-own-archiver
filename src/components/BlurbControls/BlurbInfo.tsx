import { formatDate } from '@/utils';
import { useBlurbWorkId, useWork } from '@/stores';

/**
 * Renders last-read date and read count for the active blurb work.
 *
 * @remarks Reads blurb work state from the store and formats the latest history date.
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
                    <p className="last-read datetime">
                        Last read: {date ? formatDate(date) : 'N/A'}
                    </p>
                    <p className="read-count datetime">
                        Read {work ? work.info.readCount : 0} time(s)
                    </p>
                </div>
            ) : null}
        </>
    );
}