import { create, createStore } from "zustand";
import { persist, StorageValue, createJSONStorage, StateStorage } from "zustand/middleware";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { cookieStorage } from "@/utils/browser-services";
import { browser } from "#imports";

/* https://doichevkostia.dev/blog/authentication-store-with-zustand/ */
const syncStorage: StateStorage = {
    async getItem(name: string): Promise<string | null> {
        const result = await browser.storage.sync.get(name);
        return result[name] || null;
    },
    async setItem(name: string, value: string): Promise<void> {
        await browser.storage.sync.set({ [name]: value });
    },
    async removeItem(name: string): Promise<void> {
        await browser.storage.sync.remove(name);
    },
}


// Store for spreadsheetId in Chrome sync
export const SpreadsheetStore = create<{ spreadsheetId?: string; setSpreadsheetId: (id: string) => void }>()(
    persist(
        (set) => ({
            spreadsheetId: "",
            setSpreadsheetId: (id) => set({ spreadsheetId: id }),
        }),
        {
            name: "spreadsheet-store",
            storage: createJSONStorage(() => syncStorage),
            partialize: (state) => ({ spreadsheetId: state.spreadsheetId }),
        }
    )
);

// Store for tokens in cookies
export const TokenStore = create<{ accessToken: string; refreshToken: string; setAccessToken: (t: string) => void; setRefreshToken: (t: string) => void; logout: () => void }>()(
    persist(
        (set) => ({
            accessToken: "",
            refreshToken: "",
            setAccessToken: (t) => set({ accessToken: t }),
            setRefreshToken: (t) => set({ refreshToken: t }),
            logout: () => set({ accessToken: "", refreshToken: "" }),
        }),
        {
            name: "token-store",
            storage: cookieStorage,
            partialize: (state) => ({
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
            }),
        }
    )
);

// User store type
type UserStoreType = {
    user: {
        accessToken: string;
        refreshToken: string;
        spreadsheetId?: string;
    };
    actions: {
        setAccessToken: (t: string) => void;
        setRefreshToken: (t: string) => void;
        setSpreadsheetId: (id: string) => void;
        logout: () => void;
        getUser: () => Promise<{
            accessToken: string;
            refreshToken: string;
            spreadsheetId?: string;
        }>;
        userStoreLogin: (accessToken: string, refreshToken: string, spreadsheetId?: string) => void;
    };
};
// Combined user store
export const UserStore = createStore<UserStoreType>()((set) => ({
    user: {
        accessToken: TokenStore.getState().accessToken,
        refreshToken: TokenStore.getState().refreshToken,
        spreadsheetId: SpreadsheetStore.getState().spreadsheetId,
    },
    actions: {
        setAccessToken: (t: string) => {
            TokenStore.getState().setAccessToken(t);
            set(state => ({
                user: { ...state.user, accessToken: t }
            }));
        },
        setRefreshToken: (t: string) => {
            TokenStore.getState().setRefreshToken(t);
            set(state => ({
                user: { ...state.user, refreshToken: t }
            }));
        },
        setSpreadsheetId: (id: string) => {
            SpreadsheetStore.getState().setSpreadsheetId(id);
            set(state => ({
                user: { ...state.user, spreadsheetId: id }
            }));
        },
        logout: () => {
            TokenStore.getState().logout();
            SpreadsheetStore.getState().setSpreadsheetId("");
            set({
                user: { accessToken: "", refreshToken: "", spreadsheetId: "" }
            });
        },
        getUser: async () => {
            const tokenState = TokenStore.getState();
            const sheetState = SpreadsheetStore.getState();
            const user = {
                accessToken: tokenState.accessToken,
                refreshToken: tokenState.refreshToken,
                spreadsheetId: sheetState.spreadsheetId,
            };
            set({ user });
            return user;
        },
        userStoreLogin: (accessToken: string, refreshToken: string, spreadsheetId?: string) => {
            const tokenState = TokenStore.getState();
            const sheetState = SpreadsheetStore.getState();
            log('accessToken, refreshToken, spreadsheetId', accessToken, refreshToken, spreadsheetId);
            if (accessToken) tokenState.setAccessToken(accessToken);
            if (refreshToken) tokenState.setRefreshToken(refreshToken);
            if (spreadsheetId) sheetState.setSpreadsheetId(spreadsheetId);
            set({
                user: {
                    accessToken: accessToken || tokenState.accessToken,
                    refreshToken: refreshToken || tokenState.refreshToken,
                    spreadsheetId: spreadsheetId || sheetState.spreadsheetId,
                }
            });
        }
    }
}));

export type ExtractState<S> = S extends {
        getState: () => infer T;
    }
    ? T
    : never;


export function useUserStore<U>(selector: (state: UserStoreType) => U, equalityFn?: (a: U, b: U) => boolean) {
    return useStoreWithEqualityFn(UserStore, selector, equalityFn);
}
/**
 * Custom hook to access the user data from the Zustand store.
 *
 * This hook uses the `useUserStore` function with a selector to retrieve the user data
 * and an equality function to compare the previous and next user states.
 * The equality function ensures that the component only re-renders when the user data changes.
 *
 * @returns {UserStoreType} - The current user data from the Zustand store.
 */
export const useUser = (): UserStoreType["user"] => useUserStore((state) => state.user, (a, b) => JSON.stringify(a) === JSON.stringify(b));

/**
 * Custom hook to use the actions from synced storage.
 */
export const useActions = (): UserStoreType["actions"] => useUserStore((state) => state.actions);