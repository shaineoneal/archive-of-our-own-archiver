import { createContext, useState } from 'react';
import { PropsWithChildren } from '../types';

export type LoaderStateType = {
    loader: boolean;
    setLoader: (loader: boolean) => void;
};

export const LoaderContext = createContext<LoaderStateType>({
    loader: false,
    setLoader: () => {},
});

export function LoaderProvider({ children }: PropsWithChildren) {
    const [loader, setLoader] = useState<boolean>(true);

    return (
        <LoaderContext.Provider value={{ loader, setLoader }}>
            {children}
        </LoaderContext.Provider>
    );
}
