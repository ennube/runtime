
export interface ServiceClass extends Function {
    new(): Service;
    name: string;
}

export interface Service extends Function {
}


export const serviceClasses: {
    [serviceId:string]: ServiceClass
} = { };

export const serviceInstances: {
    [serviceId:string]: Service
} = { };

/////


export class ServiceRecord {
    constructor(public serviceClass: ServiceClass) {
    }
}

export const allServiceRecords: {
    [serviceId:string]: ServiceRecord
} = { };



export const instances: {
    [serviceId:string]: Service
} = { };

export function getServiceRecord(serviceClass: ServiceClass) {
    let service = allServiceRecords[serviceClass.name];
    if( service === undefined )
        service = allServiceRecords[serviceClass.name] = new ServiceRecord(serviceClass)

    return service;
}
