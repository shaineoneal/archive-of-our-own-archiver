import { HttpRequest, HttpResponse } from "../types";

export async function makeRequest(request: HttpRequest): Promise<HttpResponse> {
    const response = await fetch(request.url, {
        method: request.method,
        headers: request.headers,
        body: request.body
    });
    const body = await response.text();
    return {
        status: response.status,
        body: body
    };
}
