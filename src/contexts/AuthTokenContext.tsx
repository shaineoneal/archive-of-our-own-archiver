import { createContext, useState } from 'react';
import { PropsWithChildren } from '../types';

/* The code `export const AuthTokenContext = createContext({ authToken: '', setAuthToken: (authToken:
string) => {} });` is creating a context object called `AuthTokenContext` using the `createContext`
function from React. */
export const AuthTokenContext = createContext({
    authToken: '',
    setAuthToken: (authToken: string) => {}
});

/**
 * The AuthTokenProvider component is a wrapper that provides an authentication token to its children
 * components.
 * @param {PropsWithChildren} children - The `AuthTokenProvider` function is a React component that takes in a
 * single prop called `children`. The `children` prop represents the child components that will be
 * rendered inside the `AuthTokenProvider` component.
 * @returns The `AuthTokenProvider` component is returning a `AuthTokenContext.Provider` component with
 * the `authToken` and `setAuthToken` values provided as the context value. The `children` prop is
 * rendered as the child components of the `AuthTokenContext.Provider`.
 */
export function AuthTokenProvider({ children }: PropsWithChildren) {
    const [authToken, setAuthToken] = useState<string>('');

    return (
        <AuthTokenContext.Provider value={{ authToken, setAuthToken }}>
            {children}
        </AuthTokenContext.Provider>
    );
}