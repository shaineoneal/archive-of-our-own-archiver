import { create } from 'zustand';

export type VerifierStateType = {
    verifier: string,
    getVerifier: () => string,
    setVerifier: (verifier: string) => void;
};

/**
 * Zustand store for managing the loader state.
 * 
 * @remarks
 * This store uses Zustand to manage a simple string loader state.
 * 
 * @example
 * ```typescript
 * const { loader, setLoader } = useLoaderStore();
 * setLoader(false); // Sets the loader state to false
 * ```
 * 
 * @returns An object containing the loader state and a function to update it.
 */
export const VerifierStore = create<VerifierStateType>()(
    (set, get): VerifierStateType => ({
        verifier: "",
        getVerifier: () => get().verifier,
        setVerifier: (verifier: string) => set({ verifier })
    })
);