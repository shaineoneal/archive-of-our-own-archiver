import { createContext, useState } from 'react';
import { PropsWithChildren } from '../types';

export const AuthTokenContext = createContext({
    authToken: '',
    setAuthToken: (authToken: string) => {}
});

export function AuthTokenProvider({ children }: PropsWithChildren) {
    const [authToken, setAuthToken] = useState<string>('');

    return (
        <AuthTokenContext.Provider value={{ authToken, setAuthToken }}>
            {children}
        </AuthTokenContext.Provider>
    );
}