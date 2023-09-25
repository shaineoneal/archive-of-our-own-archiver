import { useContext, useEffect } from 'react';
import { IconContext } from 'react-icons';
import { BsFillGearFill } from 'react-icons/bs';
import { TokenContext } from '../contexts';

export const OptionsIcon = () => {

    const { authToken } = useContext(TokenContext);

    useEffect(() => {
        console.log('useEffect');
    }, [authToken]);

    return (
        <IconContext.Provider value={{ className: 'settings-icon' }}>
            <a href="options.html">
                {authToken ? <BsFillGearFill /> : null}
            </a>
        </IconContext.Provider>
    );
}







