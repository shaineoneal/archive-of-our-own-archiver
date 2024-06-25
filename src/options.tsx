import React, { useEffect, useState } from 'react';
import { IconContext } from 'react-icons';
import { BiArrowBack } from 'react-icons/bi';
//import { fetchSpreadsheetUrl } from '../chrome-services/spreadsheet';
//import { NewSheet, Logout } from '../components';
import './styles/popup.css';
import log from './utils/logger';
import { LoaderContext } from './contexts';
import { root } from './popup'
import { LogoutButton } from './components/popup/logout';
import { fetchSpreadsheetUrl } from './chrome-services/spreadsheet';

export function openOptionsPage() {
    chrome.runtime.openOptionsPage();
}

const Options = () => {
    const [spreadsheetUrl, setSpreadsheetUrl] = useState('');
    const [ isLoading, setLoader ] = useState(false);

    useEffect(() => {
        fetchSpreadsheetUrl().then((url) => {
            log('url: ', url);
            setSpreadsheetUrl(url);
        });
    }, [spreadsheetUrl]);

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        log('heard message: ', message);
        if (message.message === 'spreadsheetUrlChanged') {
            setSpreadsheetUrl(message.newUrl);
            setLoader(false);
        }
    });

    return (
        <div id="app-container">
            <header>
                <div className="flex-container">
                    <IconContext.Provider value={{ className: 'back-icon' }}>
                        <a href="popup.html">
                            <BiArrowBack />
                        </a>
                    </IconContext.Provider>
                    <div className="title">AO3E Rewritten&apos;s Options</div>
                </div>
            </header>
            <main>
                <div className="options-container">
                    <LoaderContext.Provider value={{ isLoading, setLoader }}>
                        <div>Google Spreadsheets URL</div>
                        <input type="text" defaultValue={spreadsheetUrl} />

                        <LogoutButton />

                    </LoaderContext.Provider>
                </div>
            </main>
        </div>
    );
};

root.render(<Options />);