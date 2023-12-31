import { doesTokenExist, launchWebAuthFlow } from ".";
import { log } from "../utils";

/**
 * The function `postRequest` sends a POST request to a specified URL with a JSON body and returns the
 * JSON response.
 * @param {string} url - The `url` parameter is a string that represents the URL where the POST request
 * will be sent to. It should be a valid URL.
 * @param {any} body - The `body` parameter is the data that you want to send in the request body. It
 * can be any valid JSON object.
 * @returns a Promise that resolves to a JSON response.
 */
export async function postRequest(url: string, token: string, body: any) {

    log ('postRequest', ' auth token: ', token);

    if( !doesTokenExist() ) {
        log('ERROR in postUrl:', 'token does not exist!');
        //launchWebAuthFlow(true);
    }

    log('postRequest: ', url, body);

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(body),
    };

    const response = await fetch(url, options);
    const jsonResponse = await response.json();
    return jsonResponse;
}

export async function getRequest(url: string, token: string, body: any) {

    log ('getRequest', ' auth token: ', global.AUTH_TOKEN);

    if( !doesTokenExist() ) log('ERROR in postUrl: ', 'token does not exist!');

    log('getRequest: ', url);

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
    };

    const response = await fetch(url, options);
    const jsonResponse = await response.json();
    return jsonResponse;
}