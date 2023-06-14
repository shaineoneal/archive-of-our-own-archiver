import { createContext } from 'react';

export type LoginStateType = {
    loggedIn: boolean;
    setLoggedIn: (loggedIn: boolean) => void;
}

export const LoginContext = createContext<LoginStateType>({
    loggedIn: false,
    setLoggedIn: () => {}
});