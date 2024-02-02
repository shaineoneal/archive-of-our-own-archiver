# Archive of Our Own Archiver

## Table of contents

### Enumerations

- [HttpMethod](../wiki/HttpMethod)

### Interfaces

- [HttpRequest](../wiki/HttpRequest)
- [AuthFlowResponse](../wiki/AuthFlowResponse)
- [AuthRequestResponse](../wiki/AuthRequestResponse)

### Type Aliases

- [HttpResponse](../wiki/Exports#httpresponse)
- [PropsWithChildren](../wiki/Exports#propswithchildren)

### Variables

- [AuthTokenContext](../wiki/Exports#authtokencontext)
- [LoaderContext](../wiki/Exports#loadercontext)
- [RefreshTokenContext](../wiki/Exports#refreshtokencontext)
- [root](../wiki/Exports#root)

### Functions

- [makeRequest](../wiki/Exports#makerequest)
- [chromeLaunchWebAuthFlow](../wiki/Exports#chromelaunchwebauthflow)
- [requestAuthorizaton](../wiki/Exports#requestauthorizaton)
- [doesUserHaveRefreshToken](../wiki/Exports#doesuserhaverefreshtoken)
- [handleAuthResponse](../wiki/Exports#handleauthresponse)
- [syncStorageSet](../wiki/Exports#syncstorageset)
- [syncStorageGet](../wiki/Exports#syncstorageget)
- [syncStorageRemove](../wiki/Exports#syncstorageremove)
- [retrieveRefreshToken](../wiki/Exports#retrieverefreshtoken)
- [revokeToken](../wiki/Exports#revoketoken)
- [OptionsIcon](../wiki/Exports#optionsicon)
- [AuthTokenProvider](../wiki/Exports#authtokenprovider)
- [LoaderProvider](../wiki/Exports#loaderprovider)
- [RefreshTokenProvider](../wiki/Exports#refreshtokenprovider)
- [PopupBody](../wiki/Exports#popupbody)

### Popup

- [NoRefreshToken](../wiki/Exports#norefreshtoken)
- [LoginButton](../wiki/Exports#loginbutton)
- [Popup](../wiki/Exports#popup)

## Component

### NoRefreshToken

▸ **NoRefreshToken**(): `ReactElement`\<`any`, `string` \| `JSXElementConstructor`\<`any`\>\>

Renders a component that displays instructions for fixing the absence of a refresh token.

#### Returns

`ReactElement`\<`any`, `string` \| `JSXElementConstructor`\<`any`\>\>

The rendered component.

**`React Component`**

**`Subcategory`**

Components

#### Defined in

[components/popup/NoRefreshToken.tsx:15](https://github.com/shaineoneal/final_extension/blob/b8cbb88/src/components/popup/NoRefreshToken.tsx#L15)

___

### LoginButton

▸ **LoginButton**(): `ReactElement`

The LoginButton component is a button that triggers a login process and updates the loader state
while handling the login flow.

#### Returns

`ReactElement`

the LoginButton component 
```tsx
<div>
     <button>
         Login
     </button>
</div>

#### Defined in

[components/popup/login.tsx:22](https://github.com/shaineoneal/final_extension/blob/b8cbb88/src/components/popup/login.tsx#L22)

___

### Popup

▸ **Popup**(): `ReactElement`\<`any`, `string` \| `JSXElementConstructor`\<`any`\>\>

Main Popup UI component.
Renders header, content based on auth state.

#### Returns

`ReactElement`\<`any`, `string` \| `JSXElementConstructor`\<`any`\>\>

`<Popup />` component.

#### Defined in

[popup.tsx:104](https://github.com/shaineoneal/final_extension/blob/b8cbb88/src/popup.tsx#L104)

## Other

### HttpResponse

Ƭ **HttpResponse**: `Object`

The above type represents an HTTP response with a status code and a body.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `status` | `number` |
| `body` | `string` |

#### Defined in

[chrome-services/httpRequests.ts:49](https://github.com/shaineoneal/final_extension/blob/b8cbb88/src/chrome-services/httpRequests.ts#L49)

___

### chromeLaunchWebAuthFlow

▸ **chromeLaunchWebAuthFlow**(): `Promise`\<[`AuthFlowResponse`](../wiki/AuthFlowResponse)\>

The function `chromeLaunchWebAuthFlow` launches a web authentication flow using the Chrome Identity
API and returns a promise that resolves with the response URL and authorization code.

```
chrome.identity.launchWebAuthFlow(
     details: WebAuthFlowDetails,
     callback?: function,
)
```

#### Returns

`Promise`\<[`AuthFlowResponse`](../wiki/AuthFlowResponse)\>

The function `chromeLaunchWebAuthFlow` is returning a Promise that resolves to an
[AuthFlowResponse](../wiki/AuthFlowResponse) object.

**`See`**

[Chrome Developer API Reference - launchWebAuthFlow](https://developer.chrome.com/docs/extensions/reference/identity/#method-launchWebAuthFlow)

#### Defined in

[chrome-services/oauth.ts:72](https://github.com/shaineoneal/final_extension/blob/b8cbb88/src/chrome-services/oauth.ts#L72)

___

### requestAuthorizaton

▸ **requestAuthorizaton**(`authFlowResponse`): `Promise`\<[`AuthRequestResponse`](../wiki/AuthRequestResponse)\>

Retrieves a token from the authorization code obtained during the OAuth flow.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `authFlowResponse` | [`AuthFlowResponse`](../wiki/AuthFlowResponse) | The response object containing the authorization code. |

#### Returns

`Promise`\<[`AuthRequestResponse`](../wiki/AuthRequestResponse)\>

A promise that resolves to the token request response.

**`See`**

[Google Identity API - Exchange authorization code for refresh and access tokens](https://developers.google.com/identity/protocols/oauth2/web-server#exchange-authorization-code)

#### Defined in

[chrome-services/oauth.ts:104](https://github.com/shaineoneal/final_extension/blob/b8cbb88/src/chrome-services/oauth.ts#L104)

___

### doesUserHaveRefreshToken

▸ **doesUserHaveRefreshToken**(): `Promise`\<`string`\>

Checks if the user has a refresh token.

#### Returns

`Promise`\<`string`\>

A promise that resolves with the refresh token if the user has one, or rejects with an error if there was an error retrieving the token.

#### Defined in

[chrome-services/refresh_token.ts:8](https://github.com/shaineoneal/final_extension/blob/b8cbb88/src/chrome-services/refresh_token.ts#L8)

___

### handleAuthResponse

▸ **handleAuthResponse**(`response`, `setRefreshToken`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `response` | [`AuthRequestResponse`](../wiki/AuthRequestResponse) |
| `setRefreshToken` | (`token`: `string`) => `void` |

#### Returns

`void`

#### Defined in

[chrome-services/refresh_token.ts:26](https://github.com/shaineoneal/final_extension/blob/b8cbb88/src/chrome-services/refresh_token.ts#L26)

___

### syncStorageRemove

▸ **syncStorageRemove**(`key`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[chrome-services/storage.ts:48](https://github.com/shaineoneal/final_extension/blob/b8cbb88/src/chrome-services/storage.ts#L48)

___

### revokeToken

▸ **revokeToken**(`token`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | `string` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[chrome-services/tokens.ts:58](https://github.com/shaineoneal/final_extension/blob/b8cbb88/src/chrome-services/tokens.ts#L58)

___

### OptionsIcon

▸ **OptionsIcon**(): `Element`

Renders the options icon component.

#### Returns

`Element`

The rendered options icon component.

#### Defined in

[components/popup/optionsIcon.tsx:11](https://github.com/shaineoneal/final_extension/blob/b8cbb88/src/components/popup/optionsIcon.tsx#L11)

___

### AuthTokenContext

• `Const` **AuthTokenContext**: `Context`\<\{ `authToken`: `string` = ''; `setAuthToken`: (`authToken`: `string`) => `void`  }\>

#### Defined in

[contexts/AuthTokenContext.tsx:7](https://github.com/shaineoneal/final_extension/blob/b8cbb88/src/contexts/AuthTokenContext.tsx#L7)

___

### AuthTokenProvider

▸ **AuthTokenProvider**(`children`): `Element`

The AuthTokenProvider component is a wrapper that provides an authentication token to its children
components.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `children` | [`PropsWithChildren`](../wiki/Exports#propswithchildren) | The `AuthTokenProvider` function is a React component that takes in a single prop called `children`. The `children` prop represents the child components that will be rendered inside the `AuthTokenProvider` component. |

#### Returns

`Element`

The `AuthTokenProvider` component is returning a `AuthTokenContext.Provider` component with
the `authToken` and `setAuthToken` values provided as the context value. The `children` prop is
rendered as the child components of the `AuthTokenContext.Provider`.

#### Defined in

[contexts/AuthTokenContext.tsx:22](https://github.com/shaineoneal/final_extension/blob/b8cbb88/src/contexts/AuthTokenContext.tsx#L22)

___

### LoaderContext

• `Const` **LoaderContext**: `Context`\<\{ `isLoading`: `boolean` = false; `setLoader`: (`loader`: `boolean`) => `void`  }\>

Context for managing the loader state.

#### Defined in

[contexts/LoaderContext.tsx:8](https://github.com/shaineoneal/final_extension/blob/b8cbb88/src/contexts/LoaderContext.tsx#L8)

___

### LoaderProvider

▸ **LoaderProvider**(`children`): `Element`

Provider component for the LoaderContext.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `children` | [`PropsWithChildren`](../wiki/Exports#propswithchildren) | The child components to render. |

#### Returns

`Element`

The LoaderProvider component.
```tsx
<LoaderContext.Provider value={{ loader, setLoader }}>
   {children}
</LoaderContext.Provider>

#### Defined in

[contexts/LoaderContext.tsx:23](https://github.com/shaineoneal/final_extension/blob/b8cbb88/src/contexts/LoaderContext.tsx#L23)

___

### RefreshTokenContext

• `Const` **RefreshTokenContext**: `Context`\<\{ `refreshToken`: `string` = ''; `setRefreshToken`: (`refreshTokene`: `any`) => `void`  }\>

export const enum RefreshTokenState {
    NOT_LOADED = 'NOT_LOADED',
    VALID = 'VALID',
    INVALID = 'INVALID'
}

export type RefreshTokenType = RefreshTokenState | string;

 * Context for managing the refresh token.

#### Defined in

[contexts/RefreshTokenContext.tsx:16](https://github.com/shaineoneal/final_extension/blob/b8cbb88/src/contexts/RefreshTokenContext.tsx#L16)

___

### RefreshTokenProvider

▸ **RefreshTokenProvider**(`children`): `Element`

Provides a context for managing the refresh token.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `children` | [`PropsWithChildren`](../wiki/Exports#propswithchildren) | The child components to render. |

#### Returns

`Element`

The RefreshTokenProvider component.
```tsx
<RefreshTokenContext.Provider value={{ refreshToken, setRefreshToken }}>
    {children}
</RefreshTokenContext.Provider>

#### Defined in

[contexts/RefreshTokenContext.tsx:31](https://github.com/shaineoneal/final_extension/blob/b8cbb88/src/contexts/RefreshTokenContext.tsx#L31)

___

### PopupBody

▸ **PopupBody**(): `ReactElement`

#### Returns

`ReactElement`

#### Defined in

[popup.tsx:43](https://github.com/shaineoneal/final_extension/blob/b8cbb88/src/popup.tsx#L43)

___

### root

• `Const` **root**: `Root`

#### Defined in

[popup.tsx:134](https://github.com/shaineoneal/final_extension/blob/b8cbb88/src/popup.tsx#L134)

___

### PropsWithChildren

Ƭ **PropsWithChildren**: `Object`

The `PropsWithChildren` type is used to define a component's props that include children elements.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `children` | `JSX.Element` \| `JSX.Element`[] |

#### Defined in

[types/types.ts:10](https://github.com/shaineoneal/final_extension/blob/b8cbb88/src/types/types.ts#L10)

## chrome-services

### syncStorageSet

▸ **syncStorageSet**(`key`, `value`): `Promise`\<`void`\>

Sets a value in chrome synchronized storage.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The key to set the value for. |
| `value` | `string` | The value to be set. |

#### Returns

`Promise`\<`void`\>

A promise that resolves when the value is successfully set, or rejects with an error if there was an issue.

**`See`**

[Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)

#### Defined in

[chrome-services/storage.ts:12](https://github.com/shaineoneal/final_extension/blob/b8cbb88/src/chrome-services/storage.ts#L12)

___

### syncStorageGet

▸ **syncStorageGet**(`key`): `Promise`\<`string`\>

Retrieves the value associated with the specified key from the synchronized storage.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The key of the value to retrieve. |

#### Returns

`Promise`\<`string`\>

A promise that resolves with the retrieved value as a string.

**`See`**

[Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)

#### Defined in

[chrome-services/storage.ts:35](https://github.com/shaineoneal/final_extension/blob/b8cbb88/src/chrome-services/storage.ts#L35)

___

### retrieveRefreshToken

▸ **retrieveRefreshToken**(): `Promise`\<`string`\>

Retrieves the refresh token from Chrome storage.

#### Returns

`Promise`\<`string`\>

A promise that resolves with the refresh token string.

#### Defined in

[chrome-services/tokens.ts:45](https://github.com/shaineoneal/final_extension/blob/b8cbb88/src/chrome-services/tokens.ts#L45)

## util

### makeRequest

▸ **makeRequest**(`request`): `Promise`\<[`HttpResponse`](../wiki/Exports#httpresponse)\>

Makes an HTTP request.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`HttpRequest`](../wiki/HttpRequest) | The HTTP request object. |

#### Returns

`Promise`\<[`HttpResponse`](../wiki/Exports#httpresponse)\>

A promise that resolves to the HTTP response object.

**`Async`**

#### Defined in

[chrome-services/httpRequests.ts:62](https://github.com/shaineoneal/final_extension/blob/b8cbb88/src/chrome-services/httpRequests.ts#L62)
