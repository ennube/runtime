/// <reference types="core-js" />
import { HandlerDescriptor, HandlerDescriptorParams } from './service';
export declare namespace http {
    interface RequestData {
        resource: string;
        path: string;
        httpMethod: string;
        headers: Object;
        queryStringParameters: Object;
        pathParameters: Object;
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
        data: RequestData;
        constructor(data: RequestData);
    }
    class Response {
        protected resolve: (ResponseData) => void;
        statusCode: number;
        headers: Object;
        constructor(resolve: (ResponseData) => void);
        send(body?: string): void;
        json(body: any): void;
        end(): void;
    }
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
        private endpointDecorator(httpMethod, url);
        ANY(url: string): (servicePrototype: any, handlerName: string, descriptor: PropertyDescriptor) => void;
        GET(url: string): (servicePrototype: any, handlerName: string, descriptor: PropertyDescriptor) => void;
        POST(url: string): (servicePrototype: any, handlerName: string, descriptor: PropertyDescriptor) => void;
        PUT(url: string): (servicePrototype: any, handlerName: string, descriptor: PropertyDescriptor) => void;
        DELETE(url: string): (servicePrototype: any, handlerName: string, descriptor: PropertyDescriptor) => void;
    }
}
