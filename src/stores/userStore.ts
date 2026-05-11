import { HttpMethod, makeRequest } from "@/services";
import { storage } from '@wxt-dev/storage';
import { create } from 'zustand';
import { StorageItemKey } from '@wxt-dev/storage';

interface SpreadsheetIdStore {
    spreadsheetId: string;
    hydrateSpreadsheetId: () => Promise<void>;
    getSpreadsheetId: () => Promise<string>;
    setSpreadsheetId: (id: string) => void;
}

const ssSyncStore = storage.defineItem<string>('sync:spreadsheet-id');

const SpreadsheetIdStore = create<SpreadsheetIdStore>()(
    (set): SpreadsheetIdStore => ({
        spreadsheetId: '',
        hydrateSpreadsheetId: async () => {
            const spreadsheetId = await ssSyncStore.getValue();
            set({ spreadsheetId: spreadsheetId ?? '' });
        },
        getSpreadsheetId: async () => {
            const spreadsheetId = await ssSyncStore.getValue();
            set({ spreadsheetId: spreadsheetId ?? '' });
            return spreadsheetId ?? '';
        },
        setSpreadsheetId: (id: string) => {
            ssSyncStore.setValue(id)
                .then(() => {
                    set({ spreadsheetId: id });
                })
                .catch((error) => {
                    throw error;
                });
        }
    })
);

/** React hook to read spreadsheetId from sync storage and subscribe to updates */
export const useSpreadsheetId = () => SpreadsheetIdStore(state => state.spreadsheetId);
export const hydrateSpreadsheetId = () => SpreadsheetIdStore.getState().hydrateSpreadsheetId();
/** non-hook function to set spreadsheetId into sync storage */
export const setSpreadsheetId = (id: string) => SpreadsheetIdStore.getState().setSpreadsheetId(id);
/** non-hook function to get spreadsheetId from sync storage */
export const getSpreadsheetId = () => SpreadsheetIdStore.getState().getSpreadsheetId();

interface ITokens {
    accessToken: string;
    refreshToken: string;
}

interface ITokenStore {
    accessToken: string;
    refreshToken: string;
    setTokens(tokens: ITokens): Promise<void>;
    getAndSetTokens(): Promise<ITokens>;
    hydrateTokens(): Promise<void>;
    revokeTokens(): Promise<void>;
}

type ItemsSetType = {
    key: StorageItemKey;
    value: string;
};

const TokenStore = create<ITokenStore>()(
    (set, get) => ({
        accessToken: '',
        refreshToken: '',
        setTokens: async (tokens: ITokens) => {
            let itemsToSet: ItemsSetType[] = [];
            if (tokens.refreshToken) {
                itemsToSet.push({ key: 'local:refresh-token', value: tokens.refreshToken });
                set({ refreshToken: tokens.refreshToken });
            }
            if (tokens.accessToken) {
                itemsToSet.push({ key: 'local:access-token', value: tokens.accessToken });
                set({ accessToken: tokens.accessToken });
            }
            if (itemsToSet.length !== 0) {
                logger.debug('itemsToSet in setTokens', itemsToSet);
                await storage.setItems(itemsToSet).catch((error) => {
                    throw error;
                });
            }
        },
        getAndSetTokens: async (): Promise<ITokens> => {
            return await storage.getItems(['local:access-token', 'local:refresh-token'])
                .then((result) => {
                    logger.debug('Tokens found in storage:', result);
                    const aT = result[0]?.value as string;
                    const rT = result[1]?.value as string;
                    if (rT) {
                        set({ refreshToken: rT });
                    }
                    if (aT) {
                        set({ accessToken: aT });
                    }
                    return { accessToken: aT ?? '', refreshToken: rT ?? '' };
                })
                .catch((error) => {
                    throw error;
                });
        },
        hydrateTokens: async () => {
            await storage.getItems(['local:access-token', 'local:refresh-token'])
                .then((result) => {
                    logger.debug('tokens result', result);
                    const aT = result[0]?.value as string | undefined;
                    const rT = result[1]?.value as string | undefined;
                    const nextAccessToken = aT ?? '';
                    const nextRefreshToken = rT ?? '';
                    if (nextAccessToken !== get().accessToken) {
                        set({ accessToken: nextAccessToken });
                    }
                    if (nextRefreshToken !== get().refreshToken) {
                        set({ refreshToken: nextRefreshToken });
                    }
                })
                .catch((error) => {
                    throw error;
                });
        },
        revokeTokens: async () => {
            if (get().accessToken) {
                logger.debug('tokens result', get().accessToken);
                await makeRequest({
                    url: `https://oauth2.googleapis.com/revoke?token=${get().accessToken}`,
                    method: HttpMethod.POST,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            }
            set({ accessToken: '', refreshToken: '' });
            await storage.removeItems(['local:access-token', 'local:refresh-token']);
        }
    })
);

/** non-React function to set access and refresh tokens into local storage and Zustand state */
export const setTokens = (tokens: ITokens) => TokenStore.getState().setTokens(tokens);
/** non-React function to get access and refresh tokens from local storage via Zustand state */
export const hydrateTokens = () => TokenStore.getState().hydrateTokens();
/** non-React function to get access and refresh tokens from store */
export const getAndSetTokens = async () => TokenStore.getState().getAndSetTokens();
/** non-React function to revoke access token via Google's token revocation endpoint and remove Zustand stores */
export const revokeTokens = () => TokenStore.getState().revokeTokens();
/** React hook to read access and refresh tokens from Zustand state */
export const useTokens = () => TokenStore(state => ({ accessToken: state.accessToken, refreshToken: state.refreshToken }));