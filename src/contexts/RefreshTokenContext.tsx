import { createContext, useState } from 'react';
import { PropsWithChildren } from '../types';
import { syncStorageSet } from '..';
/**
export const enum RefreshTokenState {
    NOT_LOADED = 'NOT_LOADED',
    VALID = 'VALID',
    INVALID = 'INVALID'
}

export type RefreshTokenType = RefreshTokenState | string;


 * Context for managing the refresh token.
 */
export const RefreshTokenContext = createContext({
    refreshToken: '',
    setRefreshToken: (refreshTokene) => {}
});

/**
 * Provides a context for managing the refresh token.
 * 
 * @param children - The child components to render.
 * @returns The RefreshTokenProvider component.
 * ```tsx
 * <RefreshTokenContext.Provider value={{ refreshToken, setRefreshToken }}>
 *     {children}
 * </RefreshTokenContext.Provider>
 */
export function RefreshTokenProvider({ children }: PropsWithChildren) {
    const [refreshToken, setRefreshTokenState] = useState('');

    const setRefreshToken = (refreshToken: string) => {
        syncStorageSet('refresh_token', refreshToken);
        setRefreshTokenState(refreshToken);
    };

    return (
        <RefreshTokenContext.Provider value={{ refreshToken, setRefreshToken }}>
            {children}
        </RefreshTokenContext.Provider>
    );
}