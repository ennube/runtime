/// <reference types="core-js" />
export interface ServiceClass extends Function {
    new (): Service;
}
export declare const allServiceDescriptors: {
    [serviceId: string]: ServiceDescriptor;
};
export declare const allServiceInstances: {
    [serviceName: string]: Service;
};
export declare class ServiceDescriptor {
    serviceClass: ServiceClass;
    memoryLimit: number;
    timeLimit: number;
    managedPolicies: string[];
    handlers: {
        [methodName: string]: HandlerDescriptor;
    };
    constructor(serviceClass: ServiceClass);
    static get(serviceClass: ServiceClass): ServiceDescriptor;
    readonly instance: Service;
}
export interface ServiceSettings {
    memoryLimit?: number;
    timeLimit?: number;
    managedPolicies: string[];
}
export declare function service(settings: ServiceSettings): (serviceClass: ServiceClass) => void;
export interface HandlerDescriptorParams {
    serviceDescriptor: ServiceDescriptor;
    name: string;
}
export declare class HandlerDescriptor {
    serviceDescriptor: ServiceDescriptor;
    name: string;
    constructor(params: HandlerDescriptorParams);
}
export declare class Service {
    static get(serviceClass: ServiceClass): Service;
    private constructor();
}
