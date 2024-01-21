type method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type HttpRequest = {
    accessToken?: string;
    url: string;
    method: method;
    headers: Record<string, string>;        //same as { [key: string]: string }
    body: string | Record<string, string>;
};

export type HttpResponse = {
    status: number;
    body: string;
};

export type AuthFlowResponse = {
    url: string;
    code: string;
};

export type PropsWithChildren = {
    children: JSX.Element | JSX.Element[];
};

export type TokenRequestResponse = {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
    scope: string;
    token_type: string;
};