import { HandlerDescriptor, HandlerDescriptorParams } from '../service';
export declare const allGateways: {
    [gatewayId: string]: Gateway;
};
export interface EndpointParams extends HandlerDescriptorParams {
}
export interface Endpoint extends HandlerDescriptor {
    data?: any;
}
export interface RequestData {
    httpMethod: string;
    resource: string;
    path: string;
    pathParameters: {
        [param: string]: string;
    };
    queryStringParameters: {
        [queryParam: string]: string;
    };
    headers: {
        [headerName: string]: string;
    };
    stageVariables: {
        [headerName: string]: string;
    };
    requestContext?: {
        accountId: string;
        resourceId: string;
        stage: string;
        requestId: string;
        identity: {
            cognitoIdentityPoolId: string;
            accountId: string;
            cognitoIdentityId: string;
            caller: string;
            apiKey: string;
            sourceIp: string;
            cognitoAuthenticationType: string;
            cognitoAuthenticationProvider: string;
            userArn: string;
            userAgent: string;
            user: string;
        };
        resourcePath: string;
        httpMethod: string;
        apiId: string;
    };
    body: string;
}
export interface ResponseData {
    statusCode: number;
    headers: {
        [headerName: string]: string;
    };
    body: string;
}
export interface GatewaySettings {
}
export declare type Middleware = (req: Request, res: Response, next: () => void) => void;
export declare class Gateway {
    name: string;
    static default(): string;
    static get(name: string): Gateway;
    constructor(name: string, settings?: GatewaySettings);
    endpoints: {
        [url: string]: {
            [httpMethod: string]: Endpoint;
        };
    };
    ANY(url: string, data?: any): (servicePrototype: any, handlerName: string, descriptor: PropertyDescriptor) => void;
    HEAD(url: string, data?: any): (servicePrototype: any, handlerName: string, descriptor: PropertyDescriptor) => void;
    GET(url: string, data?: any): (servicePrototype: any, handlerName: string, descriptor: PropertyDescriptor) => void;
    POST(url: string, data?: any): (servicePrototype: any, handlerName: string, descriptor: PropertyDescriptor) => void;
    PUT(url: string, data?: any): (servicePrototype: any, handlerName: string, descriptor: PropertyDescriptor) => void;
    PATCH(url: string, data?: any): (servicePrototype: any, handlerName: string, descriptor: PropertyDescriptor) => void;
    OPTIONS(url: string, data?: any): (servicePrototype: any, handlerName: string, descriptor: PropertyDescriptor) => void;
    DELETE(url: string, data?: any): (servicePrototype: any, handlerName: string, descriptor: PropertyDescriptor) => void;
    middlewares: Middleware[];
    use(middleware: Middleware): void;
    dispatch(requestData: RequestData): Promise<ResponseData>;
}
export declare class Request {
    method: string;
    path: string;
    params: {
        [headerName: string]: string;
    };
    query: {
        [headerName: string]: string;
    };
    headers: {
        [headerName: string]: string;
    };
    body: string;
    data: any;
    constructor(event: RequestData, data: any);
    get(headerName: string): string;
    json(): any;
}
export declare class Response {
    protected request: Request;
    protected callback: any;
    statusCode: number;
    headers: {};
    constructor(request: Request, callback: any);
    status(statusCode: number): this;
    send(body: string): void;
    json(body: any): void;
    error(error: any): void;
    end(): void;
}
