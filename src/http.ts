import {HandlerDescriptor, HandlerDescriptorParams, ServiceDescriptor}
    from './service';

export namespace http {

    export interface RequestData {
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


    export class Request {
        constructor(public data: RequestData) {
        }
    }

    interface ResponseData {
        statusCode: number;
        headers: Object;
        body: string;
    }

    export class Response {
        statusCode: number = undefined;
        headers: Object = {};

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
        } = { }

        private endpointDecorator(httpMethod, url) {

            return (servicePrototype: any,
                    handlerName: string,
                    descriptor: PropertyDescriptor) => {

                if(typeof servicePrototype == 'function')
                    throw new Error(`${servicePrototype.name}.${handlerName}():` +
                                    `static handlers are not permitted`);

                let serviceClass = servicePrototype.constructor;

                let httpMethods = this.endpoints[url];
                if( httpMethods === undefined)
                    httpMethods = this.endpoints[url] = {}

                httpMethods[httpMethod] = new Endpoint({
                    serviceDescriptor: ServiceDescriptor.get(serviceClass),
                    name: handlerName,
                });

            };

        }

        ANY(url: string) {
            return this.endpointDecorator('ANY', url);
        }

        GET(url: string) {
            return this.endpointDecorator('GET', url);
        }

        POST(url: string) {
            return this.endpointDecorator('POST', url);
        }

        PUT(url: string) {
            return this.endpointDecorator('PUT', url);
        }

        DELETE(url: string) {
            return this.endpointDecorator('DELETE', url);
        }

    }


}
