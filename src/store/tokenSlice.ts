import { StateCreator } from 'zustand';

/**
 * The TokenState type in TypeScript represents an object with accessToken and refreshToken properties
 * that can be either strings or null.
 * @property {string | null} accessToken - The `accessToken` property in the `TokenState` type
 * represents a string value that contains the access token used for authentication and authorization
 * purposes. It can either be a valid string value or `null` if no access token is currently available.
 * @property {string | null} refreshToken - The `refreshToken` property in the `TokenState` type
 * represents a string value that holds the refresh token used for obtaining a new access token when
 * the current access token expires.
 */
export type TokenState = {
    accessToken: string | null;
    refreshToken: string | null;
};

/* The `export interface TokenSliceInterface` in the TypeScript code snippet is defining an interface
named `TokenSliceInterface`. This interface specifies the structure of an object that should have
the following properties and methods: */
export interface TokenSliceInterface {
    accessToken: string | null;
    refreshToken: string | null;
    setAccessToken: (accessToken: string) => void;
    setRefreshToken: (refreshToken: string) => void;
}

/* The `const initialState: TokenState = { accessToken: null, refreshToken: null };` statement in the
TypeScript code snippet is initializing a constant variable named `initialState` with a value that
conforms to the `TokenState` type. */
const initialState: TokenState = {
    accessToken: null,
    refreshToken: null,
};

/**
 * The function `createTokenSlice` is a StateCreator that initializes and manages token-related state
 * in a TypeScript application.
 * @param set - The `set` parameter in the `createTokenSlice` function is a function that is used to
 * update the state with new values. It is typically provided by the state management library you are
 * using, such as React's `useState` or Zustand's `set` function. When you call `
 */
const createTokenSlice: StateCreator<TokenSliceInterface> = (set) => ({
    accessToken: initialState.accessToken,
    refreshToken: initialState.refreshToken,
    setAccessToken: (accessToken: string) => set({ accessToken }),
    setRefreshToken: (refreshToken: string) => set({ refreshToken }),
});

export default createTokenSlice;