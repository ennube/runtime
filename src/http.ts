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
            [headerName:string]: string
//            gatewayName: string;
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
            [headerName:string]: string
        };
        body: string;
    }


    /*
        Gateway
     */


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



     export interface GatewaySettings {
         /*
         */
     };

     export class Gateway {

        static default(){
            let gatewayNames = Object.getOwnPropertyNames(http.allGateways);
            if( gatewayNames.length > 0 )
                return gatewayNames[0]
        }


        static get(name: string) {

            let gateway = allGateways[name];
            if( gateway === undefined )
                gateway = new Gateway(name);

            return gateway;
        }


        constructor(public name: string, settings:GatewaySettings={}) {
            Object.assign(this, settings);
            allGateways[name] = this;
        }

        endpoints: {
            [url:string]: {
                [httpMethod:string]: Endpoint
            }
        } = { };

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

        //dispatch(requestData: RequestData, responseCallback: (ResponseData) => void) {
        dispatch(requestData: RequestData) {

            let httpMethods = this.endpoints[requestData.resource];
            if( httpMethods === undefined )
                throw new Error(`Unnable to route '${requestData.resource}'`);

            let endpoint = httpMethods[requestData.httpMethod];
            if( endpoint === undefined ) {
                endpoint = httpMethods['ANY'];
                if( endpoint === undefined )
                    throw new Error(`Invalid method '${requestData.httpMethod}'`);
            }

            let service = endpoint.serviceDescriptor.instance;


            // apply middleware
            return new Promise( (resolve) => {

                let request = new Request(requestData);
                let response = new Response(request, resolve);
                try {
                    service[endpoint.name](request, response);
                }
                catch(e) {
                    resolve({
                        statusCode: 500,
                        headers: {},
                        body: `CRITICAL ERROR (level 3)\n\t${e}\n${e.stack}`
                    })
                }
            });
        }
    }




    export class Request {
        method: string;
        path: string;
        params: { [headerName:string]: string };
        query: { [headerName:string]: string };
        headers: { [headerName:string]: string };
        body: any;

        constructor(event: RequestData) {
            this.method = event.httpMethod;
            this.path = event.path;
            this.headers = event.headers || {};
            this.params = event.pathParameters || {};
            this.query = event.queryStringParameters || {};

            if( this.get('Content-Type') == 'application/json' )
                this.body = JSON.parse(event.body);
            else
                this.body = event.body;
        }

        get(headerName: string) {
            return this.headers[headerName];
        }

    }



    export class Response {
        statusCode: number = undefined;
        headers: {} = {};

        constructor(protected request:Request, protected callback) {

        }

        status(statusCode: number) {
            this.statusCode = statusCode;
            return this;
        }

        send(body:string) {
            console.log('SENDING', body);

            if( this.headers['Content-Type'] === undefined )
                this.headers['Content-Type'] = 'text/html; charset=utf-8';

            this.callback({
                statusCode: this.statusCode || 200,
                headers: this.headers,
                body: body
            });

        }

        json(body:any) {
            body = JSON.stringify(body);
            console.log('SENDING JSON', body);

            if( this.headers['Content-Type'] === undefined )
                this.headers['Content-Type'] = 'application/json; charset=utf-8';

            this.callback({
                statusCode: this.statusCode || 200,
                headers: this.headers,
                body: body
            });

        }

        error(error:any) {

            if( this.headers['Content-Type'] === undefined )
                this.headers['Content-Type'] = 'application/json; charset=utf-8';

            this.callback({
                statusCode: 500,
                headers: {},
                body: error
            });

        }


        end() {
            this.callback({
                statusCode: this.statusCode || 204,
                headers: this.headers,
                body: ''
            });
        }

    }

}
