import React from 'react';
import ReactDOM from 'react-dom';
import { IconContext } from 'react-icons';
import { BsFillGearFill } from 'react-icons/bs';
import { PopupBody } from '../components/popup_body';
import { LoaderProvider } from '../contexts';
import '../styles.css';

const Popup = () => {
    return (
        <>
            <header>
                <div className="flex-container">
                    <div className="logo">
                        <img src="icons/icon-32.png" alt="extension-icon" />
                    </div>
                    <div className="title">AO3E: Rewritten</div>
                    <IconContext.Provider
                        value={{ className: 'settings-icon' }}
                    >
                        <a href="options.html">
                            <BsFillGearFill />
                        </a>
                    </IconContext.Provider>
                </div>
            </header>
            <main>
                <LoaderProvider>
                    <div className="body">
                        <PopupBody />
                    </div>
                </LoaderProvider>
            </main>
        </>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <Popup />
    </React.StrictMode>,

    document.getElementById('root')
);
