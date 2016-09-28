"use strict";
exports.allServiceDescriptors = {};
exports.allServiceInstances = {};
var ServiceDescriptor = (function () {
    function ServiceDescriptor(serviceClass) {
        this.serviceClass = serviceClass;
        this.memoryLimit = 512;
        this.timeLimit = 6;
        this.managedPolicies = [];
        this.handlers = {};
        exports.allServiceDescriptors[serviceClass.name] = this;
    }
    ServiceDescriptor.get = function (serviceClass) {
        var serviceDescriptor = exports.allServiceDescriptors[serviceClass.name];
        if (serviceDescriptor === undefined)
            serviceDescriptor = new this(serviceClass);
        else if (serviceDescriptor.serviceClass !== serviceClass)
            throw new Error("Multiple service classes with same name " +
                ("" + serviceClass.name));
        return serviceDescriptor;
    };
    Object.defineProperty(ServiceDescriptor.prototype, "instance", {
        get: function () {
            var instance = exports.allServiceInstances[this.serviceClass.name];
            if (instance === undefined)
                instance = exports.allServiceInstances[this.serviceClass.name] =
                    new this.serviceClass();
            return instance;
        },
        enumerable: true,
        configurable: true
    });
    return ServiceDescriptor;
}());
exports.ServiceDescriptor = ServiceDescriptor;
function service(settings) {
    return function (serviceClass) {
        Object.assign(ServiceDescriptor.get(serviceClass), settings);
    };
}
exports.service = service;
var HandlerDescriptor = (function () {
    function HandlerDescriptor(params) {
        Object.assign(this, params);
        this.serviceDescriptor.handlers[this.name] = this;
    }
    return HandlerDescriptor;
}());
exports.HandlerDescriptor = HandlerDescriptor;
var Service = (function () {
    function Service() {
    }
    Service.get = function (serviceClass) {
        var instance = exports.allServiceInstances[serviceClass.name];
        if (instance === undefined)
            instance = exports.allServiceInstances[serviceClass.name] =
                new serviceClass();
        return instance;
    };
    return Service;
}());
exports.Service = Service;
//# sourceMappingURL=service.js.map