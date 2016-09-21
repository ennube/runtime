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
        private endpointDecorator(httpMethod, url);
        GET(url: string): (servicePrototype: any, handlerName: string, descriptor: PropertyDescriptor) => void;
        POST(url: string): (servicePrototype: any, handlerName: string, descriptor: PropertyDescriptor) => void;
        PUT(url: string): (servicePrototype: any, handlerName: string, descriptor: PropertyDescriptor) => void;
        DELETE(url: string): (servicePrototype: any, handlerName: string, descriptor: PropertyDescriptor) => void;
    }
}
