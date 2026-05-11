import { revokeTokens, useLoaderStore } from '@/stores';
import { logger } from '@/utils';
import { Button } from '@mantine/core';
import { useState } from 'react';

/**
 * Render a logout button that clears local auth state and revokes tokens.
 * @remarks Uses the stored access token when available.
 */
export const LogoutButton = () => {
    const [style] = useState('');
    const { setLoader } = useLoaderStore();

    const handleLogout = async () => {
        setLoader(true);
        logger.debug('handleLogout');
        // setStyle("visited");

        try {
            await revokeTokens();
            // return to main popup page manually
            window.location.href = 'popup.html';
        } catch (e) {
            logger.error(e);
        }
    };

    return (
        <div>
            <Button className={style} onClick={handleLogout}>Logout</Button>
        </div>
    );
};

export default LogoutButton;