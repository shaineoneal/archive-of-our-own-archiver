import { createContext } from 'react';

export const TokenContext = createContext({ 
    authToken: "", 
    setAuthToken: (authToken: string) => {} 
});