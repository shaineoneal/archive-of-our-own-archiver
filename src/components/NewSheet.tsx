import { useContext } from 'react';
import { createSpreadsheet, getLocalAccessToken } from '../chrome-services';
import { LoaderContext } from '../contexts';

export const NewSheet = () => {
    const { loader, setLoader } = useContext(LoaderContext);

    const handleNewSheet = async () => {
        setLoader(true);
        createSpreadsheet(await getLocalAccessToken())
        .then((url) => {
            chrome.storage.sync.set({ spreadsheetUrl: url });
        })

    };

    if (loader) {
        return <div className="small loader"></div>;
    }

    return (
        <div>
            <button onClick={handleNewSheet}>New Sheet</button>
        </div>
    );
};
export default NewSheet;
