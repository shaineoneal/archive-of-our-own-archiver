/**
 * Shelf state management built on Zustand with persisted browser session storage.
 *
 * @remarks
 * This module exposes:
 * - A persisted store instance
 * - Typed selector/action hooks for React components
 * - Derived hooks that map serialized state into model instances
 *
 * Persistence key: `shelf-store`
 * Persisted shape: `{ shelf: { works: Record<string, WorkInfo> } }` (actions are not persisted)
 */
import { Work, WorkInfo } from '@/models/work.tsx';
import { create } from 'zustand';
import { logger } from '@/utils/logger';
import { omit } from 'lodash';
import { persist, StorageValue } from 'zustand/middleware';
import { useEffect, useMemo } from 'react';
import { useStoreWithEqualityFn } from 'zustand/traditional';

/**
 * Actions exposed by the shelf store for CRUD-style operations on works.
 * @remarks These actions mutate the in-memory shelf and persist changes to session storage.
 */
type ShelfActionsType = {
    /**
     * Upsert a single work into the shelf.
     * @param work - Work model to store by ID.
     */
    setWork: (work: Work) => void;
    /**
     * Upsert a collection of works into the shelf.
     * @param works - Array of Work objects or a map of workId -> WorkInfo.
     */
    setShelf: (works: unknown) => void;
    /**
     * Get a single work by ID from the shelf.
     * @param workId - Work identifier.
     * @returns The Work instance if found; otherwise undefined.
     */
    getWork: (workId: string) => Promise<Work | undefined>;
    /**
     * Get all works currently stored in the shelf.
     * @returns Array of Work instances.
     */
    getShelf: () => Promise<Work[]>;
    /**
     * Remove a single work by ID from the shelf.
     * @param workId - Work identifier.
     */
    clearWork: (workId: string) => void;
    /** Remove all works from the shelf. */
    clearWorks: () => void;
}

/**
 * Serializable shelf state stored in session storage.
 */
type Shelf = {
    /** Work metadata keyed by work ID. */
    works: Record<string, WorkInfo>;
}

type ShelfStoreType = {
    shelf: Shelf;
    isHydrated: boolean;
    hydrationVersion: number;
    actions: ShelfActionsType;
}

/**
 * Zustand store for shelf data, persisted in session storage.
 */
const ShelfStore = create<ShelfStoreType>()(
    persist(
        (set, get): ShelfStoreType => ({
            shelf: { works: {} },
            isHydrated: false,
            hydrationVersion: 0,
            actions: {
                setWork: (work: Work) => {
                    logger.debug('setWork', work);
                    set((state) => ({ shelf: { works: { ...state.shelf.works, [work.workId]: work.info } } }));
                },
                setShelf: (works: unknown) => {
                    logger.debug('setShelf', works);
                    set((state) => {
                        let worksMap = {};
                        if (Array.isArray(works)) {
                            worksMap = works.reduce((acc, work) => {
                                acc[work.workId] = work.info;
                                return acc;
                            }, {} as Record<string, WorkInfo>);
                        } else if (typeof works === 'object' && works !== null) {
                            worksMap = Object.entries(works).reduce((acc, [workId, info]) => {
                                acc[workId] = info as WorkInfo;
                                return acc;
                            }, {} as Record<string, WorkInfo>);
                        } else {
                            return state;
                        }
                        return { shelf: { works: { ...state.shelf.works, ...worksMap } } };
                    });
                },
                getWork: async (workId: string) => {
                    logger.debug('getting work', workId);
                    const workInfo = get().shelf.works[workId];
                    logger.debug('workInfo', get().shelf.works);
                    return workInfo ? new Work(workId, workInfo) : undefined;
                },
                getShelf: async () => {
                    logger.debug('getting shelf');
                    const works = get().shelf.works;
                    logger.debug('works', get().shelf.works);
                    return Object.entries(works).map(([workId, info]) => new Work(workId, info));

                },
                clearWork: (workId: string) => {
                    set((state) => {
                        const works = { ...state.shelf.works };
                        delete works[workId];
                        return { shelf: { works } };
                    });
                },
                clearWorks: async () => {
                    set({ shelf: { works: {} } });
                }
            }
        }),
        {
            name: "shelf-store",
            storage: {
                async getItem(name: string): Promise<StorageValue<any>> {
                    const storedData = await browser.storage.local.get(name);
                    return { state: { shelf: { works: storedData[name] ?? {} } } };
                },
                async setItem(name: string, value: StorageValue<any>) {
                    await browser.storage.local.set({ [name]: value.state.shelf.works });
                },
                async removeItem(name: string): Promise<void> {
                    await browser.storage.local.remove(name);
                }
            },
            partialize: (state) => omit(state, ['actions']),
        }
    )
);

/**
 * Typed selector hook for `ShelfStore`.
 *
 * @typeParam U - Selected slice type.
 * @param selector - Function selecting a slice from full store state.
 * @param equalityFn - Optional comparator to reduce unnecessary rerenders.
 * @returns The selected store slice.
 *
 * @example
 * ```ts
 * const isHydrated = useShelfStore((s) => s.isHydrated);
 * ```
 */
function useShelfStore<U>(selector: (state: ShelfStoreType) => U, equalityFn?: (a: U, b: U) => boolean) {
    return useStoreWithEqualityFn(ShelfStore, selector, equalityFn);
}

/**
 * Tracks store hydration lifecycle and external storage updates.
 *
 * @returns Object containing:
 * - `isHydrated`: whether persisted state has been loaded
 * - `shelfVersion`: monotonic version incremented on hydrate/update events
 *
 * @remarks
 * `shelfVersion` increments when:
 * - Persist middleware finishes hydration
 * - `browser.storage.local.onChanged` receives updates for `shelf-store`
 */
export function useShelfHydration() {
    const isHydrated = useShelfStore((state) => state.isHydrated);
    const hydrationVersion = useShelfStore((state) => state.hydrationVersion);

    useEffect(() => {
        const markHydrated = () => {
            ShelfStore.setState((state) => ({
                isHydrated: true,
                hydrationVersion: state.hydrationVersion + 1,
            }));
        };

        if (ShelfStore.persist.hasHydrated()) {
            markHydrated();
        } else {

            const unsubscribe = ShelfStore.persist.onFinishHydration(markHydrated);
            void ShelfStore.persist.rehydrate();

            return unsubscribe;
        }
    }, []);

    useEffect(() => {
        const handleStorageChange = (changes: Record<string, { newValue?: unknown }>) => {
            const shelfChange = changes['shelf-store'];
            if (shelfChange) {
                logger.debug('shelf-store changed in storage, updating state', shelfChange.newValue);
                ShelfStore.setState((state) => ({
                    shelf: { works: (shelfChange.newValue ?? {}) as Record<string, WorkInfo> },
                    isHydrated: true,
                    hydrationVersion: state.hydrationVersion + 1,
                }));
            }
        };

        browser.storage.local.onChanged.addListener(handleStorageChange);
        return () => browser.storage.local.onChanged.removeListener(handleStorageChange);
    }, []);

    return { isHydrated, shelfVersion: hydrationVersion };
}

/**
 * Hook to access a single work by ID as a Work instance.
 * @param workId - Work identifier.
 * @returns A Work instance or undefined.
 * @remarks
 * Uses memoization to avoid rebuilding unless source info changes
 * @example
 * ```ts
 * const work = useWork('12345');
 * ```
 */
export const useWork = (workId: string) => {
    const info = useShelfStore((state) => state.shelf.works[workId]);
    return useMemo(() => info ? new Work(workId, info) : undefined, [info, workId]);
};


/**
 * Hook to access shelf actions.
 * @returns ShelfActionsType object containing CRUD operations for the shelf.
 */
export const useShelfActions = () => useShelfStore(state => state.actions);


// non-hook helpers — explicit wrappers around the store actions
export const shelfSetWork = (work: Work) => ShelfStore.getState().actions.setWork(work);
export const shelfSetShelf = (works: unknown) => ShelfStore.getState().actions.setShelf(works);
export const shelfGetWork = (workId: string) => ShelfStore.getState().actions.getWork(workId);
export const shelfGetShelf = () => ShelfStore.getState().actions.getShelf();
export const shelfClearWork = (workId: string) => ShelfStore.getState().actions.clearWork(workId);
export const shelfClearWorks = () => ShelfStore.getState().actions.clearWorks();