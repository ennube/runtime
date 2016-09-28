import {typeOf} from './type';

export interface ServiceClass extends Function {
    new(): Service;
}

export const allServiceDescriptors: {
    [serviceId:string]: ServiceDescriptor
} = { };

export const allServiceInstances: {
    [serviceName:string]: Service
} = { };


export class ServiceDescriptor {

    memoryLimit: number = 512;
    timeLimit: number = 6;
    managedPolicies: string[] = [];

    handlers: {
        [methodName:string]: HandlerDescriptor
    } = { };

    constructor(public serviceClass: ServiceClass) {
        allServiceDescriptors[serviceClass.name] = this;
    }

    static get(serviceClass: ServiceClass) {

        let serviceDescriptor = allServiceDescriptors[serviceClass.name];
        if( serviceDescriptor === undefined )
            serviceDescriptor = new this(serviceClass);

        else if(serviceDescriptor.serviceClass !== serviceClass)
            throw new Error(`Multiple service classes with same name ` +
                            `${serviceClass.name}`);

        return serviceDescriptor;
    }

    get instance() {
        let instance = allServiceInstances[this.serviceClass.name];
        if( instance === undefined)
            instance = allServiceInstances[this.serviceClass.name] =
                new this.serviceClass();

        return instance;
    }
}

export interface ServiceSettings {
    memoryLimit?: number;
    timeLimit?: number;
    managedPolicies: string[];
}

export function service(settings: ServiceSettings) {
    return (serviceClass: ServiceClass) => {
        Object.assign(
            ServiceDescriptor.get(serviceClass),
            settings
        );
    };
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
        //allServiceInstances[typeOf(this).name] = this;
    }
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
