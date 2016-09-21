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
