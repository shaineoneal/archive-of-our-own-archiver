import { create } from 'zustand';
import { persist, StorageValue } from 'zustand/middleware';
import { useStoreWithEqualityFn } from 'zustand/traditional';
import { omit } from 'lodash';
import { Work, WorkInfo } from '@/models/work.tsx';

type WorkActionsType = {
    setWork: (work: Work) => void;
    setWorks: (works: Work[]) => void;
    getWork: (workId: number) => Promise<Work | undefined>;
    getWorks: () => Promise<Work[]>;
    clearWork: (workId: number) => void;
    clearWorks: () => void;
}

type WorkStoreType = {
    works: Record<string, WorkInfo>;
    actions: WorkActionsType;
}

export const WorkStore = create<WorkStoreType>()(
    persist(
        (set, get): WorkStoreType => ({
            works: {},
            actions: {
                setWork: (work: Work) => {
                    logger.debug('setWork', work);
                    set({ works: { ...get().works, [work.workId]: work.info } });
                },
                setWorks: (works: Work[]) => {
                    logger.debug('setWorks', works);
                    const worksMap = works.reduce((acc, work) => {
                        acc[work.workId] = work.info;
                        return acc;
                    }, {} as Record<string, WorkInfo>);
                    set({ works: { ...get().works, ...worksMap } });
                },
                getWork: async (workId: number) => {
                    logger.debug('getting work', workId);
                    const workInfo = get().works[workId];
                    if (workInfo) {
                        return new Work(workId, workInfo);
                    }
                    return undefined;
                },
                getWorks: async () => {
                    return get().works ? Object.entries(get().works).map(([workId, info]) => new Work(Number(workId), info)) : [];
                },
                clearWork: (workId: number) => {
                    set({ works: omit(get().works, [workId.toString()]) });
                },
                clearWorks: () => {
                    set({ works: {} });
                }
            }
        }),
        {
            name: "work-store",
            storage: {
                async getItem(name: string): Promise<StorageValue<any>> {
                    const storedData = await browser.storage.session.get(name);
                    const works = storedData[name] as Array<Work>;
                    return { state: { works: works ?? {} } };
                },
                async setItem(name: string, storageValue: StorageValue<any>) {
                    await browser.storage.session.set({ [name]: storageValue.state.works });
                },
                async removeItem(name: string): Promise<void> {
                    await browser.storage.session.remove(name)
                }
            },
            partialize: (state) => omit(state, ['actions'])
        }
    )
);

type ExtractState<S> = S extends {
        getState: () => infer T;
    }
    ? T
    : never;

const workSelector = (state: ExtractState<typeof WorkStore>) => state.works;
const workActionsSelector = (state: ExtractState<typeof WorkStore>) => state.actions;

export function useWorkStore<U>(selector: (state: WorkStoreType) => U, equalityFn?: (a: U, b: U) => boolean) {
    return useStoreWithEqualityFn(WorkStore, selector, equalityFn);
}

export const useWork = () => useWorkStore(workSelector);
export const useWorkActions = () => useWorkStore(workActionsSelector);
