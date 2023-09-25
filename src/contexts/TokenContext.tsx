import { createContext, useState } from 'react';
import { PropsWithChildren } from '../types';

export const TokenContext = createContext({
    authToken: '',
    setAuthToken: (authToken: string) => {},
});

export function TokenProvider({ children }: PropsWithChildren) {
    const [authToken, setAuthToken] = useState<string>('');

    return (
        <TokenContext.Provider value={{ authToken, setAuthToken }}>
            {children}
        </TokenContext.Provider>
    );
}
