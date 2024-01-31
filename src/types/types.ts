type method = 'GET' | 'POST' | 'PUT' | 'DELETE';

/**
 * The above type represents an HTTP request object with optional access token, URL, method, headers,
 * and body.
 * @property {string} accessToken - The `accessToken` property is an optional string that represents an
 * access token used for authentication or authorization purposes. It can be included in the headers or
 * as a query parameter in the URL.
 * @property {string} url - The `url` property is a string that represents the URL of the HTTP request.
 * It specifies the location where the request should be sent.
 * @property {method} method - The `method` property represents the HTTP method to be used for the
 * request, such as "GET", "POST", "PUT", "DELETE", etc.
 * @property headers - The `headers` property is an object that represents the HTTP headers to be
 * included in the request. It is a key-value pair where the key is the header name and the value is
 * the header value.
 * @property {string | Record<string, string>} body - The `body` property in the `HttpRequest` type can
 * be either a string or an object of key-value pairs where both the keys and values are strings.
 */
export type HttpRequest = {
    accessToken?: string;
    url: string;
    method: method;
    headers: Record<string, string>;        //same as { [key: string]: string }
    body: string | Record<string, string>;
};

/**
 * The above type represents an HTTP response with a status code and a body.
 * @property {number} status - The status property represents the HTTP status code of the response. It
 * is a number that indicates the outcome of the request. Common status codes include 200 for a
 * successful request, 404 for a resource not found, and 500 for a server error.
 * @property {string} body - The `body` property in the `HttpResponse` type represents the response
 * body of an HTTP request. It is of type `string`, which means it can contain any textual data
 * returned by the server.
 */
export type HttpResponse = {
    status: number;
    body: string;
};


/**
 * The `PropsWithChildren` type is used to define a component's props that include children elements.
 * @property {JSX.Element | JSX.Element[]} children - The `children` property is a special prop in
 * React that allows you to pass components or elements as children to a parent component. It can
 * accept a single JSX element or an array of JSX elements. This is commonly used to create reusable
 * and flexible components that can render different content based on their children.
 */
export type PropsWithChildren = {
    children: JSX.Element | JSX.Element[];
};

/**
 * The `TokenRequestResponse` type represents the response received when requesting a token, including
 * the access token, expiration time, refresh token (optional), scope, and token type.
 * @property {string} access_token - The access token is a string that is used to authenticate and
 * authorize requests to access protected resources. It is typically included in the headers of API
 * requests.
 * @property {number} expires_in - The `expires_in` property represents the duration in seconds for
 * which the access token is valid. After this duration, the access token will expire and can no longer
 * be used to authenticate requests.
 * @property {string} refresh_token - The `refresh_token` property is an optional property in the
 * `TokenRequestResponse` type. It is used for obtaining a new access token when the current access
 * token expires.
 * @property {string} scope - The "scope" property in the TokenRequestResponse type represents the
 * scope of the access token. It specifies the level of access and permissions granted to the token.
 * The scope can be used to control what resources or actions the token can access.
 * @property {string} token_type - The `token_type` property in the `TokenRequestResponse` type
 * represents the type of token that is being returned. This can be used to determine the format or
 * protocol of the token, such as "Bearer" for OAuth 2.0 tokens.
 */
export type TokenRequestResponse = {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
    scope: string;
    token_type: string;
};