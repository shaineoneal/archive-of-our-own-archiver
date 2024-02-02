# Interface: AuthRequestResponse

Represents the response of an authentication request.

## Table of contents

### Properties

- [access\_token](../wiki/AuthRequestResponse#access_token)
- [expires\_in](../wiki/AuthRequestResponse#expires_in)
- [refresh\_token](../wiki/AuthRequestResponse#refresh_token)
- [scope](../wiki/AuthRequestResponse#scope)
- [token\_type](../wiki/AuthRequestResponse#token_type)

## Properties

### access\_token

• **access\_token**: `string`

Short lived token used to access Google APIs.

#### Defined in

[chrome-services/oauth.ts:50](https://github.com/shaineoneal/final_extension/blob/018e8b4/src/chrome-services/oauth.ts#L50)

___

### expires\_in

• **expires\_in**: `number`

The number of seconds the access token is valid for.

#### Defined in

[chrome-services/oauth.ts:51](https://github.com/shaineoneal/final_extension/blob/018e8b4/src/chrome-services/oauth.ts#L51)

___

### refresh\_token

• `Optional` **refresh\_token**: `string`

(optional) A long lived token used to obtain new access tokens.

#### Defined in

[chrome-services/oauth.ts:52](https://github.com/shaineoneal/final_extension/blob/018e8b4/src/chrome-services/oauth.ts#L52)

___

### scope

• **scope**: `string`

The scope of the access token.

#### Defined in

[chrome-services/oauth.ts:53](https://github.com/shaineoneal/final_extension/blob/018e8b4/src/chrome-services/oauth.ts#L53)

___

### token\_type

• **token\_type**: `string`

The type of token.

#### Defined in

[chrome-services/oauth.ts:54](https://github.com/shaineoneal/final_extension/blob/018e8b4/src/chrome-services/oauth.ts#L54)
