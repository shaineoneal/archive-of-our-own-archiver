import React, { useEffect } from 'react';
import { SyncUserStore, useActions, useUser } from '../../../utils/zustand';
import { IconContext } from 'react-icons';
import { BiArrowBack } from 'react-icons/bi';
import { NewSheet, Logout } from './';
import { createRoot } from 'react-dom/client';
import '../../../styles.css';
import log from '../../../utils/logger';
export function openOptionsPage() {
    chrome.runtime.openOptionsPage();
}

/**
 * The main component for the options page.
 * @returns the Options component
 */
const Options =  () => {

    let { setSpreadsheetId } = useActions();
    let { spreadsheetId } = SyncUserStore.getState().user;
    let spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;

    useEffect(() => {
        spreadsheetId = SyncUserStore.getState().user.spreadsheetId;
    }, [spreadsheetId]);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const regex = /^https:\/\/docs\.google\.com\/spreadsheets\/d\/([A-Za-z0-9_-]+)(\/|$)/;

        const match = event.target.value.match(regex);
        log('match: ', match);
        if(match && match[1]) {
            const spreadsheetId = match[1];
            log('new spreadsheetId: ', spreadsheetId);
            setSpreadsheetId(spreadsheetId);
            //TODO: set spreadsheetId
        } else {
            //TODO: handle invalid url
        }

    };

    //TODO: evaluate if this is needed
    //chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //    log('heard message: ', message);
    //    if (message.message === 'spreadsheetUrlChanged') {
    //        setSpreadsheetUrl(message.newUrl);
    //        setLoader(false);
    //    }
    //});

    return (
        <>
            <header>
                <div className="flex-container">
                    <IconContext.Provider value={{className: 'back-icon'}}>
                        <a href="popup.html">
                            <BiArrowBack/>
                        </a>
                    </IconContext.Provider>
                    <div className="title">AO3E Rewritten&apos;s Options</div>
                </div>
            </header>
            <main>
                <div className="options-container">
                    <div>Google Spreadsheets URL</div>
                    <input 
                        type="text" 
                        defaultValue={spreadsheetUrl}
                        onChange={onChange}
                    />
                    <Logout/>
                    <NewSheet/>
                </div>
            </main>
        </>
    );
};

export const root = createRoot(document.getElementById("root")!);

root.render(
    <Options />
);