/// <reference types="core-js" />
import { Class } from './type';
export interface ServiceClass extends Class<Service> {
}
export interface Service extends Object {
}
export declare const allServices: {
    [serviceId: string]: {
        serviceClass: ServiceClass;
        memoryLimit: Number;
        timeLimit: Number;
    };
};
export declare const serviceInstances: {
    [serviceId: string]: Service;
};
export declare function ensureService(serviceClass: ServiceClass): {
    serviceClass: ServiceClass;
    memoryLimit: Number;
    timeLimit: Number;
};
export declare function serviceDecorator(params: {
    memoryLimit?: Number;
    timeLimit?: Number;
}): (serviceClass: ServiceClass) => void;
