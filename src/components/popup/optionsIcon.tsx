import { useContext, useEffect } from 'react';
import { IconContext } from 'react-icons';
import { BsFillGearFill } from 'react-icons/bs';
import { AccessTokenContext } from '../../contexts';

/**
 * Renders the options icon component.
 * 
 * @returns The rendered options icon component.
 */
export const OptionsIcon = () => {

    const { accessToken } = useContext(AccessTokenContext);

    useEffect(() => {
        //to ensure that the options icon reloads when the user logs in
    }, [accessToken]);

    return (
        <IconContext.Provider value={{ className: 'settings-icon' }}>
            <a href="options.html">
                { accessToken ? <BsFillGearFill /> : null }
            </a>
        </IconContext.Provider>
    );
}