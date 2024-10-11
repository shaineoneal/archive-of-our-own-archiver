import { useEffect } from 'react';
import { IconContext } from 'react-icons';
import { BsFillGearFill } from 'react-icons/bs';
import { TokenContext } from '../contexts';
import log from '../utils/logger';
import { useUser } from '../utils/zustand/userStore';

export const OptionsIcon = () => {

    const accessT = useUser().accessToken;

    useEffect(() => {
       log('optionsIcon useEffect');
    }, [accessT]);

    return (
        <IconContext.Provider value={{ className: 'settings-icon' }}>
            <a href="options.html">
                {accessT ? <BsFillGearFill /> : null}
            </a>
        </IconContext.Provider>
    );
}