import { getLocalAccessToken, createSpreadsheet } from '../../../utils/chrome-services';
import { useLoaderStore } from '../../../utils/zustand';

export const NewSheet = () => {
    const { loader, setLoader } = useLoaderStore();

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
