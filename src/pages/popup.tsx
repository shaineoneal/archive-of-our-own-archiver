import { useEffect } from 'react';
import { PopupBody, OptionsIcon } from '../components';
import '../styles.css';
import { createRoot } from 'react-dom/client';
import { useUser } from '../utils/zustand';



const Popup = () => {

    const user = useUser();

    useEffect(() => {
        //to ensure that the options icon reloads when the user logs in
    }, [user]);


    return (
        <>
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
                <div className="body">
                    <PopupBody />
                </div>
            </main>
        </>
    );
};

export const root = createRoot(document.getElementById("root")!);

root.render(
    <Popup />
);