/// <reference types="core-js" />
import { HandlerDescriptor, HandlerDescriptorParams } from './service';
export declare namespace http {
    const allGateways: {
        [gatewayId: string]: Gateway;
    };
    interface EndpointParams extends HandlerDescriptorParams {
    }
    class Endpoint extends HandlerDescriptor {
    }
    interface RequestData {
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
            gatewayName: string;
        };
        requestContext: {
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
    interface ResponseData {
        statusCode: number;
        headers: {
            [headerName: string]: string;
        };
        body: string;
    }
    interface GatewaySettings {
    }
    class Gateway {
        name: string;
        static default(): string;
        static get(name: string): Gateway;
        constructor(name: string, settings?: GatewaySettings);
        endpoints: {
            [url: string]: {
                [httpMethod: string]: Endpoint;
            };
        };
        ANY(url: string): (servicePrototype: any, handlerName: string, descriptor: PropertyDescriptor) => void;
        HEAD(url: string): (servicePrototype: any, handlerName: string, descriptor: PropertyDescriptor) => void;
        GET(url: string): (servicePrototype: any, handlerName: string, descriptor: PropertyDescriptor) => void;
        POST(url: string): (servicePrototype: any, handlerName: string, descriptor: PropertyDescriptor) => void;
        PUT(url: string): (servicePrototype: any, handlerName: string, descriptor: PropertyDescriptor) => void;
        PATCH(url: string): (servicePrototype: any, handlerName: string, descriptor: PropertyDescriptor) => void;
        OPTIONS(url: string): (servicePrototype: any, handlerName: string, descriptor: PropertyDescriptor) => void;
        DELETE(url: string): (servicePrototype: any, handlerName: string, descriptor: PropertyDescriptor) => void;
        dispatch(requestData: RequestData): Promise<{}>;
    }
    class Request {
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
        body: any;
        constructor(event: RequestData);
        get(headerName: string): string;
    }
    class Response {
        protected request: Request;
        protected callback: any;
        statusCode: number;
        headers: {};
        constructor(request: Request, callback: any);
        status(statusCode: number): this;
        send(body: string): void;
        json(body: any): void;
        end(): void;
    }
}
