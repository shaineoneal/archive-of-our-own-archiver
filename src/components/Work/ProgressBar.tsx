import React from "react";

/**
 * Props for {@link ProgressBar}.
 */
export type ProgressBarProps = {
    /** Words already read. */
    current: number;
    /** Total words in the work. */
    total: number;
    /** Words in the current chapter. */
    thisChap: number;
};

/**
 * Displays reading progress for a work with chapter-level context.
 *
 * @param props - Progress values used to render the bar and labels.
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, thisChap }) => {

    /** Percent of the total already read. */
    const progressPercent = (current / total) * 100;
    /** Percent that includes the current chapter chunk. */
    const currentPercent = ((thisChap / total) * 100) + progressPercent;

    return (
        <div>
            <div className="progress-bar">
                <div className='progress current-progress' style={{ width: `${currentPercent}%`}}>
                    <span className="tooltip">
                        {thisChap} words
                    </span>
                </div>
                <div className='progress read-progress' style={{ width: `${progressPercent}%` }}>
                    <span className="tooltip">
                        {current} words
                    </span>
                </div>

            </div>
            <span>
                {current} / {total}
            </span>
        </div>
    );
}