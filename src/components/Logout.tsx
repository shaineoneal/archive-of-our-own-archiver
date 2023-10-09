import { useState } from 'react';
import { removeToken } from '../chrome-services';

export const Logout = () => {
    const [style, setStyle] = useState("");

    const handleLogout = () => {
        setStyle("visited");
        global.AUTH_TOKEN = '';
        removeToken();
    };

    return (
        <div >
            <a className='no-underline' href="popup.html">
                <button className={style} onClick={handleLogout} >Logout</button>
            </a>
        </div>
    );
};

export default Logout;
