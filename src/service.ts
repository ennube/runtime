import {typeOf} from './type';

export interface ServiceClass extends Function {
    new(): Service;
}




export const allServiceDescriptors: {
    [serviceId:string]: ServiceDescriptor
} = { };

export class ServiceDescriptor {

    static get(serviceClass: ServiceClass) {

        let serviceDescriptor = allServiceDescriptors[serviceClass.name];
        if( serviceDescriptor === undefined )
            serviceDescriptor = new this(serviceClass);

        else if(serviceDescriptor.serviceClass !== serviceClass)
            throw new Error(`Multiple service classes with same name ` +
                            `${serviceClass.name}`);

        return serviceDescriptor;
    }

    constructor(public serviceClass: ServiceClass) {
        allServiceDescriptors[serviceClass.name] = this;
    }

    memoryLimit: Number = 512;
    timeLimit: Number = 6;
    handlers: {
        [methodName:string]: HandlerDescriptor
    } = { };
}

export interface HandlerDescriptorParams {
    serviceDescriptor: ServiceDescriptor;
    name: string;

}

export class HandlerDescriptor {
    serviceDescriptor: ServiceDescriptor;
    name: string;

/*
    static get(serviceClass: ServiceClass, handlerName:string) {
        let serviceDescriptor = ServiceDescriptor.get(serviceClass);

        let handler = serviceDescriptor.handlers[handlerName];
        if( handler === undefined )
            handler = new this(serviceDescriptor, handlerName);
    }
*/
    constructor(params: HandlerDescriptorParams) {
        Object.assign(this, params);
            // checks name collision..
        this.serviceDescriptor.handlers[this.name] = this;
    }

}

export const allServiceInstances: {
    [serviceName:string]: Service
} = { };

export class Service {
    static get(serviceClass: ServiceClass) {

        let instance = allServiceInstances[serviceClass.name];
        if( instance === undefined)
            instance = allServiceInstances[serviceClass.name] =
                new serviceClass();

        return instance;
    }
    private constructor() {
        // TODO: check instance name collision..
        allServiceInstances[typeOf(this).name] = this;
    }
}

export function service(params: {
    memoryLimit?: Number,
    timeLimit?: Number,
}) {
    return (serviceClass: ServiceClass) => {
        Object.assign(
            ServiceDescriptor.get(serviceClass),
            params
        );
    };
}
/*
export function makeHandlerDescriptorDecorator( callback: (HandlerDescriptor) => any ) {

    return (servicePrototype: any,
            handlerName: string,
            descriptor: PropertyDescriptor) => {

        if(typeof servicePrototype == 'function')
            throw new Error(`${servicePrototype.name}.${handlerName}():` +
                            `static handlers are not permitted`);

        let serviceClass = servicePrototype.constructor;

        let handler = HandlerDescriptor.get(serviceClass, handlerName);

        return callback(handler);


    };
}
*/
