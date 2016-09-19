import {ensureService, ServiceClass} from './service';

export namespace http {

    export const allGateways: {
        [gatewayId:string]: Gateway
    } = { };

    export class Gateway {
        endpoints: {
            [url:string]: {
                [method:string]: Endpoint
            }
        } = { }
    }

    export class Endpoint {
        service: Object;
        method: string;
//        serviceClass: ServiceClass;
//        isStatic: Boolean;
    }

    function endpointDecorator(gatewayId: string, url: string, method:string) {

        return (servicePrototype: any, handlerMethod: string, descriptor: PropertyDescriptor) => {
            if(typeof servicePrototype == 'function')
                throw new Error(`${servicePrototype.name}.${handlerMethod}():` +
                                `static handlers are not permitted`);

            // este decorador tambien puede ser usado
            // con un string MOCK ruta a una plantilla
            // o un objeto que especificará un reenvio http
            // debe de contemplarse tambien los allowed content/types...
            // debe de poderse indicar un middleware en funcion del content type?
            // 

            let serviceClass = servicePrototype.constructor;

            let gateway = allGateways[gatewayId];
            if( gateway === undefined)
                gateway = allGateways[gatewayId] = new Gateway();

            let methods = gateway.endpoints[url];
            if( methods === undefined)
                methods = gateway.endpoints[url] = {}

            let endpoint = methods[method]
            if( endpoint === undefined)
                endpoint = methods[method] = new Endpoint();

            endpoint.service = ensureService(serviceClass);
//          TODO: via  ensureServiceMethod(handlerMethod):
            endpoint.method = handlerMethod;
//            endpoint.serviceClass = serviceClass;
//            endpoint.isStatic = false;
        };
    }

    export function GET(gatewayId: string, url: string) {
        return endpointDecorator(gatewayId, url, 'get');
    }

    export function POST(gatewayId: string, url: string) {
        return endpointDecorator(gatewayId, url, 'post');
    }

    export function PUT(gatewayId: string, url: string) {
        return endpointDecorator(gatewayId, url, 'put');
    }

    export function DELETE(gatewayId: string, url: string) {
        return endpointDecorator(gatewayId, url, 'delete');
    }

    export function authorizer() {
        // puede ser custom o iam...
    }
}
