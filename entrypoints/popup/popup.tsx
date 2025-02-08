import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { PopupBody } from './main/popup_body.tsx';
import { useUser } from '@/utils/zustand';
import { OptionsIcon } from './main/optionsIcon.tsx';
import '@/src/styles.css';



/**
 * The popup component.
 * This component will display either a login or the GoToSheet component based on the user's login status.
 * If the user is not logged in, it will display a login button.
 * If the user is logged in, it will display the GoToSheet component.
 * If the user's access token is invalid, it will exchange the refresh token for an access token.
 * If the user does not have a refresh token, it will log the user out.
 * @category Component
 * @group Popup
 * @returns the Popup component
 */
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