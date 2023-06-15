import React, { createContext, useState } from 'react';
import { checkLoginStatus } from '../background/checkLoginStatus';
import { log } from '../utils/logger';

export type LoginStateType = {
    loggedIn: boolean | null;
    setLoggedIn: (loggedIn: boolean) => void;
}

export const LoginContext = createContext<LoginStateType>({
    loggedIn: null,
    setLoggedIn: () => {}
});

export const useLogin = async () => {
    log("useLogin");
    const [loggedIn, setLoggedIn] = useState(await checkLoginStatus());
    return { loggedIn, setLoggedIn };
};
