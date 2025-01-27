import { Ao3_BaseWork, BaseWork } from "../../pages/content-script";
import log from "../logger";
import { User_BaseWork } from "../../pages/content-script/User_BaseWork";
import { log } from "../logger";
import { MessageResponse } from "../types/MessageResponse";

let port: chrome.runtime.Port | null = null;

// Initializes the port in the content script
export const initializePort = () => {
    console.log("Initializing port...");
    if (!port) {
        port = chrome.runtime.connect({ name: "persistent-port" });

        port.onDisconnect.addListener(() => {
            log("Port disconnected.");
            port = null;
        });
    }
};

export const closePort = () => {
    if (port) {
        port.disconnect();
        port = null;
    }
}

/**
 * Enum of message names.
 *
 * Each message name is a property of the Messages interface.
 */
export enum MessageName {
    AddWorkToSheet = 'addWorkToSheet',
    CheckLogin = 'checkLogin',
    GetAccessToken = 'getAccessToken',
    QuerySpreadsheet = 'querySpreadsheet',
    RemoveWorkFromSheet = 'removeWorkFromSheet',
    RefreshAccessToken = 'refreshAccessToken',
    UpdateWorkInSheet = 'updateWorkInSheet',
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
    [MessageName.AddWorkToSheet]: {
        payload: {
            work: Ao3_BaseWork;
        };
        response: User_BaseWork;
    };
    [MessageName.CheckLogin]: {
        payload: {};
        response: {
            status: boolean;
        };
    }
    [MessageName.GetAccessToken]: {
        payload: {
            reason: string;
        };
        response: string;
    };
    [MessageName.QuerySpreadsheet]: {
        payload: {
            list: number[];
        };
        response: boolean[];
    };
    [MessageName.RemoveWorkFromSheet]: {
        payload: {
            workId: number;
        };
        response: boolean;
    };
    [MessageName.RefreshAccessToken]: {
        payload: {};
        response: string;
    };
    [MessageName.UpdateWorkInSheet]: {
        payload: {
            work: User_BaseWork;
        };
        response: boolean;
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
    if (!port) {
        console.error('Port not initialized');
        return;
    }
    port.postMessage( { name, payload } );

    //Listen for a single response
    const onResponse = (response: MessageResponse<T>) => {
        callback(response);
        port?.onMessage.removeListener(onResponse);
    }
    port.onMessage.addListener(onResponse);
};



export const createMessageHandlers = (handlers: {
    [K in MessageTypes]?: (payload: MessagePayload<K>) => Promise<MessageResponse<K>>;
}): void => {
    chrome.runtime.onConnect.addListener((port) => {
        port.onMessage.addListener(async (message) => {
            const { name, payload } = message;

            const handler = handlers[message.name as MessageTypes];
            if (!handler) {
                port.postMessage({ error: `No handler for message: ${name}` });
                return;
            }

            try {
                const response = await handler(payload);
                port.postMessage( response );
            } catch (error) {
                port.postMessage({ error });
            }
        });
    });
};