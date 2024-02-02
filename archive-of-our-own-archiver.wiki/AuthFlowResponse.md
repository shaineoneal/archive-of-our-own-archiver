# Interface: AuthFlowResponse

The AuthFlowResponse type represents the response object containing a URL and a code.

## Table of contents

### Properties

- [url](../wiki/AuthFlowResponse#url)
- [code](../wiki/AuthFlowResponse#code)

## Properties

### url

• **url**: `string`

A string representing the URL for the authentication flow.

#### Defined in

[chrome-services/oauth.ts:36](https://github.com/shaineoneal/final_extension/blob/b8cbb88/src/chrome-services/oauth.ts#L36)

___

### code

• **code**: `string`

The `code` property is a string that represents the authorization code
generated during the authentication flow. This code is typically used to exchange for an access
token, which can then be used to make authorized API requests.

#### Defined in

[chrome-services/oauth.ts:37](https://github.com/shaineoneal/final_extension/blob/b8cbb88/src/chrome-services/oauth.ts#L37)
