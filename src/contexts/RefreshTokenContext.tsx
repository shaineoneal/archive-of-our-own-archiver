import { createContext, useState } from 'react';
import { PropsWithChildren } from '../types';

export const RefreshTokenContext = createContext({
    refreshToken: '',
    setRefreshToken: (refreshToken: string) => {}
});

export function RefreshTokenProvider({ children }: PropsWithChildren) {
    const [refreshToken, setRefreshToken] = useState<string>('');

    return (
        <RefreshTokenContext.Provider value={{ refreshToken, setRefreshToken }}>
            {children}
        </RefreshTokenContext.Provider>
    );
}