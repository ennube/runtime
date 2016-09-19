
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

export function registerServiceClass(serviceClass: ServiceClass){
    serviceClasses[serviceClass.name] = serviceClass;
}
