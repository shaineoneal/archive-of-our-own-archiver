type method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type HttpRequest = {
    accessToken: string;
    url: string;
    method: method;
    headers: Record<string, string>;        //same as { [key: string]: string }
    body: string;
};

export type HttpResponse = {
    status: number;
    body: string;
};

export type AuthFlowResponse = {
    url: string | undefined;
    accessToken: string;
    expiresIn: number;
};

export type PropsWithChildren = {
    children: JSX.Element | JSX.Element[];
};