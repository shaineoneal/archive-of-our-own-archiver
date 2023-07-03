import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { IconContext } from 'react-icons';
import { BiArrowBack } from 'react-icons/bi';
import { fetchSpreadsheetUrl } from '../chrome-services/spreadsheet';
import { ForgetSheet, Logout } from '../components';
import '../styles.css';
import { log } from '../utils/logger';

export function openOptionsPage() {
    chrome.runtime.openOptionsPage();
}

const Options = () => {
    const [spreadsheetUrl, setSpreadsheetUrl] = useState('');

    useEffect(() => {
        fetchSpreadsheetUrl().then((url) => {
            log('url: ', url);
            setSpreadsheetUrl(url);
        });
    }, [spreadsheetUrl]);

    return (
        <>
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
                    <div>Google Spreadsheets URL</div>
                    <input type="text" defaultValue={spreadsheetUrl} />
                    <Logout />
                    <ForgetSheet />
                </div>
            </main>
        </>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <Options />
    </React.StrictMode>,

    document.getElementById('root')
);
