import React, { createContext, useState } from 'react';
import { checkLoginStatus } from '../background/checkLoginStatus';

export type LoginStateType = {
    loggedIn: boolean | null;
    setLoggedIn: (loggedIn: boolean) => void;
}

export const LoginContext = createContext<LoginStateType>({
    loggedIn: null,
    setLoggedIn: () => {}
});

export const useLogin = async () => {
    const [loggedIn, setLoggedIn] = useState(await checkLoginStatus());
    return { loggedIn, setLoggedIn };
};
