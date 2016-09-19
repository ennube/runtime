/// <reference types="core-js" />
export declare namespace http {
    const allGateways: {
        [gatewayId: string]: Gateway;
    };
    class Gateway {
        endpoints: {
            [url: string]: {
                [method: string]: Endpoint;
            };
        };
    }
    class Endpoint {
        service: Object;
        method: string;
    }
    function GET(gatewayId: string, url: string): (servicePrototype: any, handlerMethod: string, descriptor: PropertyDescriptor) => void;
    function POST(gatewayId: string, url: string): (servicePrototype: any, handlerMethod: string, descriptor: PropertyDescriptor) => void;
    function PUT(gatewayId: string, url: string): (servicePrototype: any, handlerMethod: string, descriptor: PropertyDescriptor) => void;
    function DELETE(gatewayId: string, url: string): (servicePrototype: any, handlerMethod: string, descriptor: PropertyDescriptor) => void;
    function authorizer(): void;
}
