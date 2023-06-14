import { createContext } from 'react';

export type LoaderStateType = {
    loader: boolean;
    setLoader: (loggedIn: boolean) => void;
}

export const LoaderContext = createContext<LoaderStateType>({
    loader: false,
    setLoader: () => {}
});
