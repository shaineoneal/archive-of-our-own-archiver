import { useContext, useEffect } from 'react';
import { IconContext } from 'react-icons';
import { BsFillGearFill } from 'react-icons/bs';
import { AuthTokenContext } from '../../contexts';

export const OptionsIcon = () => {

    const { authToken } = useContext(AuthTokenContext);

    useEffect(() => {
        //to ensure that the options icon reloads when the user logs in
    }, [authToken]);

    return (
        <IconContext.Provider value={{ className: 'settings-icon' }}>
            <a href="options.html">
                { authToken ? <BsFillGearFill /> : null }
            </a>
        </IconContext.Provider>
    );
}