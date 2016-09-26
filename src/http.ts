import {HandlerDescriptor, HandlerDescriptorParams, ServiceDescriptor}
    from './service';

export namespace http {

    export const allGateways: {
        [gatewayId:string]: Gateway
    } = { };


    export interface EndpointParams extends HandlerDescriptorParams {

    };

    export class Endpoint extends HandlerDescriptor {

    };

    export class Gateway {
        static get(name: string) {
            let gateway = allGateways[name];
            if( gateway === undefined )
                gateway = new Gateway(name);

            return gateway;
        }

        constructor(public name: string) {
            allGateways[name] = this;
        }

        endpoints: {
            [url:string]: {
                [httpMethod:string]: Endpoint
            }
        } = { };

//        middleWare: [] = [];

        dispatch() {
        }

        ANY(url: string) {
            return endpointDecorator(this, 'ANY', url);
        }

        HEAD(url: string) {
            return endpointDecorator(this, 'HEAD', url);
        }

        GET(url: string) {
            return endpointDecorator(this, 'GET', url);
        }

        POST(url: string) {
            return endpointDecorator(this, 'POST', url);
        }

        PUT(url: string) {
            return endpointDecorator(this, 'PUT', url);
        }

        PATCH(url: string) {
            return endpointDecorator(this, 'PATCH', url);
        }

        OPTIONS(url: string) {
            return endpointDecorator(this, 'OPTIONS', url);
        }

        DELETE(url: string) {
            return endpointDecorator(this, 'DELETE', url);
        }

    }

    function endpointDecorator(gateway:Gateway, httpMethod:string, url:string) {

        return (servicePrototype: any,
                handlerName: string,
                descriptor: PropertyDescriptor) => {

            if(typeof servicePrototype == 'function')
                throw new Error(`${servicePrototype.name}.${handlerName}():` +
                                `static handlers are not permitted`);

            let serviceClass = servicePrototype.constructor;

            let httpMethods = gateway.endpoints[url];
            if( httpMethods === undefined)
                httpMethods = gateway.endpoints[url] = {}

            httpMethods[httpMethod] = new Endpoint({
                serviceDescriptor: ServiceDescriptor.get(serviceClass),
                name: handlerName,
            });

        };

    }

    export interface RequestData {
        httpMethod: string;
        resource: string;
        path: string;
        pathParameters: {
            [param:string]: string
        };
        queryStringParameters: {
            [queryParam:string]: string
        };
        headers: {
            [headerName:string]: string
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


    export class Request {
        method: string;
        path: string;
        params: {};
        query: {};
        body: string;

        constructor(event: RequestData) {
            this.method = event.httpMethod;
            this.path = event.path;
            this.params = event.pathParameters || {};
            this.query = event.queryStringParameters || {};
            this.body = event.body;
        }
    }

    interface ResponseData {
        statusCode: number;
        headers: {};
        body: string;
    }

    export class Response {
        statusCode: number = undefined;
        headers: {} = {};

        constructor(protected resolve: (ResponseData) => void) {

        }

        send(body:string = null) {

            if( this.headers['Content-Type'] === undefined )
                this.headers['Content-Type'] = 'text/html; charset=utf-8';

            this.resolve({
                statusCode: this.statusCode,
                headers: this.headers,
                body
            });

        }


        json(body:any) {

            if( this.headers['Content-Type'] === undefined )
                this.headers['Content-Type'] = 'application/json; charset=utf-8';

            this.resolve({
                statusCode: this.statusCode || 200,
                headers: this.headers,
                body: JSON.stringify(body)
            });
        }

        end() {
            this.resolve({
                statusCode: this.statusCode || 204,
                headers: this.headers,
                body: null
            });
        }

    }

}
