import log from '../../utils/logger';

/**
 * Represents the HTTP method for to use in the request.
 */
export const enum  HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

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
/**
 * Represents an HTTP request.
 */
export interface HttpRequest {
    accessToken?: string;
    url: string;
    method: HttpMethod;
    headers: any;
    body: any;
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
export type HttpResponse = Response;

/**
 * Makes an HTTP request.
 * 
 * @async
 * @category util
 * @param {HttpRequest} request - The HTTP request object.
 * @returns A promise that resolves to the HTTP response object.
 */
export async function makeRequest(request: HttpRequest): Promise<HttpResponse> {
    const options = {
        method: request.method,
        headers: request.headers,
        body: JSON.stringify(request.body)
    };

    log('makeRequest options: ', options);

    const response = await fetch(request.url, options);
    return response;
}