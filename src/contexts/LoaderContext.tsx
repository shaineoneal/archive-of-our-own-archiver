import { createContext, useState } from 'react';
import { PropsWithChildren } from '../types';
import log from '../utils/logger';

/**
 * Context for managing the loader state.
 */
export const LoaderContext = createContext({
    isLoading: false,
    setLoader: (loader: boolean) => {}
});

/**
 * Provider component for the LoaderContext.
 * 
 * @param children - The child components to render.
 * @returns The LoaderProvider component.
 * ```tsx
 * <LoaderContext.Provider value={{ loader, setLoader }}>
 *    {children}
 * </LoaderContext.Provider>
 * ```
 */
export function LoaderProvider({ children }: PropsWithChildren) {
    const [isLoading, setLoaderState] = useState<boolean>(false);

    const setLoader = (loader: boolean) => {
        log(`loader set to ${loader}`);
        setLoaderState(loader);
    };

    return (
        <LoaderContext.Provider value={{ isLoading, setLoader }}>
            {children}
        </LoaderContext.Provider>
    );
}