import { create } from 'zustand';

type LoaderStateType = {
    loader: boolean
    setLoader: (loader: boolean) => void;
};

/**
 * Zustand store for managing the loader state.
 * 
 * @remarks
 * This store uses Zustand to manage a simple boolean loader state.
 * 
 * @example
 * ```typescript
 * const { loader, setLoader } = useLoaderStore();
 * setLoader(false); // Sets the loader state to false
 * ```
 * 
 * @returns An object containing the loader state and a function to update it.
 */
export const useLoaderStore = create<LoaderStateType>()(
    (set): LoaderStateType => ({
        loader: true,
        setLoader: (loader: boolean) => set({ loader })
    })
);