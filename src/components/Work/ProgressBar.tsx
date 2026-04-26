export const ProgressBar: React.FC<{ current: number; total: number; thisChap: number; }> = ({ current, total, thisChap }) => {

    const progressPercent = (current / total) * 100;
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