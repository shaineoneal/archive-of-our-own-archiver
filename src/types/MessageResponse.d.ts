/**
 * Interface describing the shape of a message response.
 *
 * A message response has a response and an optional error.
 */
export interface MessageResponse<T> {
    response: T;
    error?: string;
}
