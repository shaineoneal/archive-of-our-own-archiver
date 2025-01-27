import { create, useStore } from "zustand";
import { persist, StorageValue } from "zustand/middleware";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { getStore, removeStore, setStore, StoreMethod } from "../chrome-services";

/* https://doichevkostia.dev/blog/authentication-store-with-zustand/ */

const DEFAULT_USER: UserDataType = {
    isLoggedIn: false,
    accessToken: undefined,
    refreshToken: undefined
}

type UserDataType = {
    isLoggedIn: boolean;
    accessToken?: string;
    refreshToken?: string;
    spreadsheetId?: string;
}

type UserActionsType = {
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    setAccessToken: (accessT?: string) => void;
    setRefreshToken: (refreshT?: string) => void;
    setSpreadsheetId: (spreadsheetId?: string) => void;
    userStoreLogin: (accessToken?: string, refreshToken?: string) => void;
    logout: () => void;
}

type UserStoreType = {
    user: UserDataType;
    actions: UserActionsType;
}

/**
 * Zustand store for user data with persistence.
 */
export const SyncUserStore = create<UserStoreType>()(
    persist(
        (set, get): UserStoreType => ({
            user: DEFAULT_USER,

            actions: {
                setIsLoggedIn: (isLoggedIn: boolean) => {
                    set({ user: { ...get().user, isLoggedIn: isLoggedIn } });
                },
                setAccessToken: (accessT?: string) => {
                    set({ user: { ...get().user, accessToken: accessT } });
                },
                setRefreshToken: (refreshT?: string) => {
                    set({ user: { ...get().user, refreshToken: refreshT } });
                },
                setSpreadsheetId: (spreadsheetId?: string) => {
                    set({ user: { ...get().user, spreadsheetId: spreadsheetId } });
                },
                userStoreLogin: async ( accessToken, refreshToken ) => {
                    const { setAccessToken, setRefreshToken } = get().actions;
                    set({ user: { ...get().user, isLoggedIn: true } });
                    setAccessToken(accessToken);
                    setRefreshToken(refreshToken);
                },
                logout: () => {
                    set({ user: { ...get().user, accessToken: undefined, refreshToken: undefined, isLoggedIn: false } });
                }
            }
        }),
        {
            name: 'user-store',
            storage: {
                async getItem(name: string): Promise<StorageValue<any>> {

                    const data = await getStore(name, StoreMethod.SYNC);
                    return {
                        state: data[name]
                    };
                },

                async setItem(name: string, storageValue: StorageValue<any>) {
                    await setStore(name, storageValue.state, StoreMethod.SYNC);
                },

                async removeItem(name: string): Promise<void> {
                    await removeStore(name, StoreMethod.SYNC);
                }
            },
            partialize: (state) => {
                return omit(state, ['actions']);
            }
        }
    )
);

export const SessionUserStore = create<UserStoreType>() (
    (set, get): UserStoreType => ({
        user: DEFAULT_USER,
        actions: {
            setIsLoggedIn: (isLoggedIn: boolean) => {
                set({ user: { ...get().user, isLoggedIn: isLoggedIn } });
            },
            setAccessToken: (accessT?: string) => {
                set({ user: { ...get().user, accessToken: accessT } });
            },
            setRefreshToken: (refreshT?: string) => {
                set({ user: { ...get().user, refreshToken: refreshT } });
            },
            setSpreadsheetId: (spreadsheetId?: string) => {
                set({ user: { ...get().user, spreadsheetId: spreadsheetId } });
            },
            userStoreLogin: async ( accessToken, refreshToken ) => {
                const { setAccessToken, setRefreshToken } = get().actions;
                set({ user: { ...get().user, isLoggedIn: true } });
                setAccessToken(accessToken);
                setRefreshToken(refreshToken);
            },
            logout: () => {
                set({ user: { ...get().user, accessToken: undefined, refreshToken: undefined, isLoggedIn: false } });
            }
        }
    })
);

export type ExtractState<S> = S extends {
        getState: () => infer T;
    }
    ? T
    : never;
    type Params<U> = Parameters<typeof useStore<typeof SyncUserStore, U>>;

const userSelector = (state: ExtractState<typeof SyncUserStore>) => state.user;
const actionsSelector = (state: ExtractState<typeof SyncUserStore>) => state.actions;

export function useUserStore<U>(selector: (state: UserStoreType) => U, equalityFn?: (a: U, b: U) => boolean) {
    return useStoreWithEqualityFn(SyncUserStore, selector, equalityFn);
}

/**
 * Custom hook to use the user data from synced storage.
 */
export const useUser = () => useUserStore(userSelector);

/**
 * Custom hook to use the actions from synced storage.
 */
export const useActions = () => useUserStore(actionsSelector);