import { useContext, useEffect } from 'react';
import { IconContext } from 'react-icons';
import { BsFillGearFill } from 'react-icons/bs';
import { RefreshTokenContext } from '../../contexts';

/**
 * Renders the options icon component.
 * 
 * @returns The rendered options icon component.
 */
export const OptionsIcon = () => {

    const { refreshToken } = useContext(RefreshTokenContext);

    useEffect(() => {
        //to ensure that the options icon reloads when the user logs in
    }, [refreshToken]);

    return (
        <IconContext.Provider value={{ className: 'settings-icon' }}>
            <a href="options.html">
                { refreshToken ? <BsFillGearFill /> : null }
            </a>
        </IconContext.Provider>
    );
}