import React, { useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { PopupBody } from '../components/popup_body';
import { LoaderProvider, TokenContext, TokenProvider } from '../contexts';
import '../styles.css';
import { log } from '../utils';
import { OptionsIcon } from '../components/optionsIcon';

const Popup = () => {

    const { authToken } = useContext(TokenContext);

    useEffect(() => {
        log('useEffect');
    }, [authToken]);


    return (
        
        <TokenProvider>
            <header>
                <div className="flex-container">
                    <div className="logo">
                        <img src="icons/icon-32.png" alt="extension-icon" />
                    </div>
                    <div className="title">AO3E: Rewritten</div>
                    <OptionsIcon />
                </div>
            </header>
            <main>
                <LoaderProvider>
                    <div className="body">
                        <PopupBody />
                    </div>
                </LoaderProvider>
            </main>
        </TokenProvider>
        
    );
};

ReactDOM.render(
    <React.StrictMode>
        <Popup />
    </React.StrictMode>,

    document.getElementById('root')
);
