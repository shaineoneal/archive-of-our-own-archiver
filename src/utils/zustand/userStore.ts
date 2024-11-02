import { create, useStore } from "zustand";
import { persist, StorageValue } from "zustand/middleware";
import { getStore, removeStore, setStore, StoreMethod } from "../chrome-services";
import { omit } from "remeda";
import log from "../logger";

/* https://doichevkostia.dev/blog/authentication-store-with-zustand/ */

const DEFAULT_USER: UserDataType = {
    isLoggedIn: false,
    accessToken: undefined,
    refreshToken: undefined
}

type UserDataType = {
    isLoggedIn: boolean;
    accessToken: string | undefined;
    refreshToken: string | undefined;
    spreadsheetId?: string | undefined;
}

type UserStoreType = {
    user: UserDataType;

    actions: {
        setIsLoggedIn: (isLoggedIn: boolean) => void;
        setAccessToken: (accessT: string | undefined) => void;
        setRefreshToken: (refreshT: string | undefined) => void;
        setSpreadsheetId: (spreadsheetId: string | undefined) => void;
        userStoreLogin: (accessToken: string | undefined, refreshToken: string | undefined) => Promise<void>;
        logout: () => void;
    };
}

export const userStore = create<UserStoreType>()(
    persist(
        (set, get) => ({
            user: DEFAULT_USER,

            actions: {
                setIsLoggedIn: (isLoggedIn: boolean) => {
                    set({ user: { ...get().user, isLoggedIn: isLoggedIn } });
                },
                setAccessToken: (accessT: string | undefined) => {
                    set({ user: { ...get().user, accessToken: accessT } });
                },
                setRefreshToken: (refreshT: string | undefined) => {
                    set({ user: { ...get().user, refreshToken: refreshT } });
                },
                setSpreadsheetId: (spreadsheetId: string | undefined) => {
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
                    log('getItem: ', name, 'data: ', data);
                    return { 
                        state: data[name]
                    };
                },

                async setItem(name: string, storageValue: StorageValue<any>) {
                    log('setItem: ', name, 'data: ', storageValue.state);
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

export type ExtractState<S> = S extends {
        getState: () => infer T;
    }
    ? T
    : never;
    type Params<U> = Parameters<typeof useStore<typeof userStore, U>>;

const userSelector = (state: ExtractState<typeof userStore>) => state.user;
const isLoggedInSelector = (state: ExtractState<typeof userStore>) => state.user.isLoggedIn;
const accessTokenSelector = (state: ExtractState<typeof userStore>) => state.user.accessToken;
const refreshTokenSelector = (state: ExtractState<typeof userStore>) => state.user.refreshToken;
const spreadsheetIdSelector = (state: ExtractState<typeof userStore>) => state.user.spreadsheetId;
const actionsSelector = (state: ExtractState<typeof userStore>) => state.actions;

export const getUser = () => userSelector(userStore.getState());
export const getIsLoggedIn = () => isLoggedInSelector(userStore.getState());
export const getAccessToken = () => accessTokenSelector(userStore.getState());
export const getRefreshToken = () => refreshTokenSelector(userStore.getState());
export const getSpreadsheetId = () => spreadsheetIdSelector(userStore.getState())
export const getActions = () => actionsSelector(userStore.getState())

function useUserStore<U>(selector: (state: UserStoreType) => U, equalityFn?: (a: U, b: U) => boolean) {
    return useStore(userStore, selector, equalityFn);
}

export const useUser = () => useUserStore(userSelector);
export const useActions = () => useUserStore(actionsSelector);