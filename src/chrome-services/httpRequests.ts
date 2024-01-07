import { HttpRequest, HttpResponse } from "../types";
import log from "../utils/logger";

export async function makeRequest(request: HttpRequest): Promise<HttpResponse> {
    log('makeRequest: ', request);

    const response = await fetch(request.url, {
        method: request.method,
        headers: request.headers,
        body: JSON.stringify(request.body) 
    });
    const body = await response.text();
    return {
        status: response.status,
        body: body
    };
}
