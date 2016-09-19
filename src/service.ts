//export namespace service {
import {Class} from './type';

export interface ServiceClass extends Class<Service> {
}

export interface Service extends Object {
}

export const allServices: {
    [serviceId:string]: {
        serviceClass: ServiceClass,
        memoryLimit: Number,
        timeLimit: Number
    }
} = { };

export const serviceInstances: {
    [serviceId:string]: Service
} = { };

export function ensureService(serviceClass: ServiceClass) {
    let serviceId = serviceClass.name;

    let service = allServices[serviceId];
    if( service === undefined)
        service = allServices[serviceId] = {
            serviceClass: serviceClass,
            memoryLimit: 256,
            timeLimit: 6,
        };

    return service;
}

export function serviceDecorator(params: {
    memoryLimit?: Number,
    timeLimit?: Number,
}) {
    return (serviceClass: ServiceClass) => {
        let service = ensureService(serviceClass);
        Object.assign(service, params);
    };
}


//}
