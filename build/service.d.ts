/// <reference types="core-js" />
export interface ServiceClass extends Function {
    new (): Service;
}
export declare const allServiceDescriptors: {
    [serviceId: string]: ServiceDescriptor;
};
export declare class ServiceDescriptor {
    serviceClass: ServiceClass;
    static get(serviceClass: ServiceClass): ServiceDescriptor;
    constructor(serviceClass: ServiceClass);
    memoryLimit: Number;
    timeLimit: Number;
    handlers: {
        [methodName: string]: HandlerDescriptor;
    };
}
export interface HandlerDescriptorParams {
    serviceDescriptor: ServiceDescriptor;
    name: string;
}
export declare class HandlerDescriptor {
    serviceDescriptor: ServiceDescriptor;
    name: string;
    constructor(params: HandlerDescriptorParams);
}
export declare const allServiceInstances: {
    [serviceName: string]: Service;
};
export declare class Service {
    static get(serviceClass: ServiceClass): Service;
    private constructor();
}
export declare function service(params: {
    memoryLimit?: Number;
    timeLimit?: Number;
}): (serviceClass: ServiceClass) => void;
