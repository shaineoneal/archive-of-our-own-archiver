import { useEffect } from 'react';
import { IconContext } from 'react-icons';
import { BsFillGearFill } from 'react-icons/bs';
import log from '../utils/logger';
import { useUser } from '../utils/zustand/userStore';

/**
 * OptionsIcon component renders an icon that links to the options page.
 * It uses the user's access token to determine whether to display the icon.
 * 
 * @component
 * @example
 * return (
 *   <OptionsIcon />
 * )
 * 
 * @returns {JSX.Element} The rendered component.
 * 
 * @remarks
 * This component uses the `useUser` hook to get the access token and 
 * `useEffect` to log when the component is mounted or updated.
 * 
 * @see {@link https://reactjs.org/docs/hooks-effect.html|useEffect}
 * @see {@link https://reactjs.org/docs/hooks-reference.html#usecontext|useContext}
 */
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