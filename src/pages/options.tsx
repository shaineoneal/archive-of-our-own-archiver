import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import { IconContext } from 'react-icons';
import { BiArrowBack } from 'react-icons/bi';
import { fetchSheetUrl } from '../chrome-services/sheet';
import { Logout, ForgetSheet } from '../components';
import { log } from '../utils/logger';
import '../styles.css';

export function openOptionsPage() {
    chrome.runtime.openOptionsPage();
}

const Options = () => {
    const [sheetUrl, setSheetUrl] = useState('');

    useEffect(() => {
        fetchSheetUrl().then((url) => {
            log('url: ', url);
            setSheetUrl(url);
        });
    }, [sheetUrl]);

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
                    <div>Google Sheets URL</div>
                    <input type="text" defaultValue={sheetUrl} />
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
