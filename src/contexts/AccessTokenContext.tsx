import { createContext, useState } from 'react';
import { PropsWithChildren } from '../types';
import { syncStorageSet } from '..';

/* The code `export const AccessTokenContext = createContext({ accessToken: '', setAccessToken: (accessToken:
string) => {} });` is creating a context object called `AccessTokenContext` using the `createContext`
function from React. */
export const AccessTokenContext = createContext({
    accessToken: '',
    setAccessToken: (accessToken: string) => {}
});

/**
 * The AccessTokenProvider component is a wrapper that provides an accessentication token to its children
 * components.
 * @param {PropsWithChildren} children - The `AccessTokenProvider` function is a React component that takes in a
 * single prop called `children`. The `children` prop represents the child components that will be
 * rendered inside the `AccessTokenProvider` component.
 * @returns The `AccessTokenProvider` component is returning a `AccessTokenContext.Provider` component with
 * the `accessToken` and `setAccessToken` values provided as the context value. The `children` prop is
 * rendered as the child components of the `AccessTokenContext.Provider`.
 */
export function AccessTokenProvider({ children }: PropsWithChildren) {
    const [ accessToken, setAccessTokenState ] = useState('');

    const setAccessToken = (accessToken: string) => {
        syncStorageSet('access_token', accessToken);
        setAccessTokenState(accessToken);
    };

    return (
        <AccessTokenContext.Provider value={{ accessToken, setAccessToken }}>
            {children}
        </AccessTokenContext.Provider>
    );
};