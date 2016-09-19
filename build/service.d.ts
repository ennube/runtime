/// <reference types="core-js" />
export interface ServiceClass extends Function {
    new (): Service;
    name: string;
}
export interface Service extends Function {
}
export declare const serviceClasses: {
    [serviceId: string]: ServiceClass;
};
export declare const serviceInstances: {
    [serviceId: string]: Service;
};
export declare function registerServiceClass(serviceClass: ServiceClass): void;
