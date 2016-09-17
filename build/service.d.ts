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
export declare class ServiceRecord {
    serviceClass: ServiceClass;
    constructor(serviceClass: ServiceClass);
}
export declare const allServiceRecords: {
    [serviceId: string]: ServiceRecord;
};
export declare const instances: {
    [serviceId: string]: Service;
};
export declare function getServiceRecord(serviceClass: ServiceClass): ServiceRecord;
