import { createContext, useState } from 'react';
import { PropsWithChildren } from '../types';

export const LoaderContext = createContext({
    loader: false,
    setLoader: (loader: boolean) => {}
});

export function LoaderProvider({ children }: PropsWithChildren) {
    const [loader, setLoader] = useState<boolean>(false);

    return (
        <LoaderContext.Provider value={{ loader, setLoader }}>
            {children}
        </LoaderContext.Provider>
    );
}