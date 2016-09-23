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
    class Gateway {
        name: string;
        static get(name: string): Gateway;
        constructor(name: string);
        endpoints: {
            [url: string]: {
                [httpMethod: string]: Endpoint;
            };
        };
        dispatch(): void;
        ANY(url: string): (servicePrototype: any, handlerName: string, descriptor: PropertyDescriptor) => void;
        HEAD(url: string): (servicePrototype: any, handlerName: string, descriptor: PropertyDescriptor) => void;
        GET(url: string): (servicePrototype: any, handlerName: string, descriptor: PropertyDescriptor) => void;
        POST(url: string): (servicePrototype: any, handlerName: string, descriptor: PropertyDescriptor) => void;
        PUT(url: string): (servicePrototype: any, handlerName: string, descriptor: PropertyDescriptor) => void;
        PATCH(url: string): (servicePrototype: any, handlerName: string, descriptor: PropertyDescriptor) => void;
        OPTIONS(url: string): (servicePrototype: any, handlerName: string, descriptor: PropertyDescriptor) => void;
        DELETE(url: string): (servicePrototype: any, handlerName: string, descriptor: PropertyDescriptor) => void;
    }
    interface RequestData {
        httpMethod: string;
        resource: string;
        path: string;
        pathParameters: Object;
        queryStringParameters: Object;
        headers: Object;
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
    class Request {
        method: string;
        path: string;
        params: any;
        query: any;
        body: string;
        constructor(event: RequestData);
    }
    class Response {
        protected resolve: (ResponseData) => void;
        statusCode: number;
        headers: any;
        constructor(resolve: (ResponseData) => void);
        send(body?: string): void;
        json(body: any): void;
        end(): void;
    }
}
