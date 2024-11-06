import { BaseWork } from "../../pages/content-script";

/**
 * Enum of message names.
 *
 * Each message name is a property of the Messages interface.
 */
export enum MessageName {
    GetAccessToken = 'getAccessToken',
    AddWorkToSheet = 'addWorkToSheet',
    QuerySpreadsheet = 'querySpreadsheet',
}

/**
 * Interface describing the shape of a message.
 *
 * A message has a payload and a response.
 */
interface Message {
    payload: unknown;
    response: unknown;
}

/**
 * Interface describing the shape of all messages.
 *
 * Each property of the Messages interface represents a message name.
 * The value of each property is an object with two properties: payload and response.
 * The payload property represents the data sent in the message.
 * The response property represents the data returned in the response.
 */
interface Messages extends Partial<Record<MessageName, Message>> {
    [MessageName.GetAccessToken]: {
        payload: {
            reason: string;
        };
        response: string;
    };
    [MessageName.AddWorkToSheet]: {
        payload: {
            work: BaseWork;
        };
        response: boolean;
    };
    [MessageName.QuerySpreadsheet]: {
        payload: {
            list: number[];
        };
        response: boolean[];
    };
}

/**
 * Type representing all message names.
 *
 * Used to infer the type of the message name parameter in sendMessage and receiveMessage.
 */
type MessageTypes = keyof Messages;

/**
 * Type representing the payload of a message.
 *
 * Used to infer the type of the payload parameter in sendMessage and receiveMessage.
 * @param T - The message name.
 */
type MessagePayload<T extends MessageTypes> = Messages[T]['payload']

/**
 * Type representing the response of a message.
 *
 * Used to infer the type of the response parameter in sendMessage and receiveMessage.
 * @param T - The message name.
 */
type MessageResponse<T extends MessageTypes> = Messages[T]['response']

/**
 * Type representing the callback of a message.
 *
 * Used to infer the type of the callback parameter in sendMessage and receiveMessage.
 * @param T - The message name.
 */
type MessageCallback<T extends MessageTypes> = (response: MessageResponse<T>) => void;

/**
 * Sends a message to the background script.
 *
 * @async
 * @param name - The name of the message to send.
 * @param payload - The data to send in the message.
 * @param callback - A function that processes the response.
 */
export const  sendMessage = <T extends MessageTypes>(
    name: T,
    payload: MessagePayload<T>,
    callback: MessageCallback<T>,
): void => {
    chrome.runtime.sendMessage(
        { name, payload },
        callback
    );
};

/**
 * Registers a message listener for a specific message type.
 *
 * @template T - The type of the message.
 * @param name - The name of the message to listen for.
 * @param responder - A function that processes the message payload and returns a promise with the response.
 * 
 * @example
 * receiveMessage('exampleMessage', async (payload) => {
 *   // Process the payload and return a response
 *   return { success: true };
 * });
 */
export const receiveMessage = <T extends MessageTypes>(
    name: T,
    responder: (payload: MessagePayload<T>) => Promise<MessageResponse<T>>,
): void => {
    chrome.runtime.onMessage.addListener(
        (request: { name: T, payload: MessagePayload<T> }, _, callback: MessageCallback<T>): boolean => {
            if (request.name !== name) return false;
            
            responder(request.payload)
                .then(callback)
                .catch(console.log);
            
            return true;
        },
    );
};
