import React, { useContext } from "react";
import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";

/**
 * Local per-blurb state used by controls in a single panel instance.
 */
type BlurbState = {
    /** Work id extracted from the AO3 blurb element id. */
    workId: string;
    /** The target blurb element associated with this control panel. */
    targetBlurb: Element;
};

/**
 * Type alias for the local Zustand vanilla store instance.
 */
export type BlurbStoreType = ReturnType<typeof createBlurbStore>;

/**
 * Create a local Zustand store for one blurb panel.
 * @param initialState - Initial work context for this panel.
 * @returns Vanilla Zustand store containing `BlurbState`.
 */
export function createBlurbStore(initialState: BlurbState) {
    return createStore<BlurbState>(() => initialState);
}

/**
 * Context holding a local `BlurbStoreType` for nested controls.
 */
export const BlurbStoreContext = React.createContext<BlurbStoreType | null>(null);

/**
 * Selector hook for reading from the local `BlurbStoreType`.
 * @typeParam T - Selected state slice type.
 * @param selector - Selector for the local blurb state.
 * @returns Selected state value.
 * @throws Error when used outside `BlurbStoreContext.Provider`.
 */
function useBlurbStore<T>(selector: (state: BlurbState) => T): T {
    const store = useContext(BlurbStoreContext);
    if (!store) {
        throw new Error('BlurbStoreContext is missing for BlurbPanelContent');
    }
    return useStore(store, selector);
}

export const useBlurbWorkId = () => useBlurbStore((state) => state.workId);
export const useBlurbTargetBlurb = () => useBlurbStore((state) => state.targetBlurb);
