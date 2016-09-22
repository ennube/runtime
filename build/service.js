"use strict";
var type_1 = require('./type');
exports.allServiceDescriptors = {};
var ServiceDescriptor = (function () {
    function ServiceDescriptor(serviceClass) {
        this.serviceClass = serviceClass;
        this.memoryLimit = 512;
        this.timeLimit = 6;
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
    return ServiceDescriptor;
}());
exports.ServiceDescriptor = ServiceDescriptor;
var HandlerDescriptor = (function () {
    function HandlerDescriptor(params) {
        Object.assign(this, params);
        this.serviceDescriptor.handlers[this.name] = this;
    }
    return HandlerDescriptor;
}());
exports.HandlerDescriptor = HandlerDescriptor;
exports.allServiceInstances = {};
var Service = (function () {
    function Service() {
        exports.allServiceInstances[type_1.typeOf(this).name] = this;
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
function service(params) {
    return function (serviceClass) {
        Object.assign(ServiceDescriptor.get(serviceClass), params);
    };
}
exports.service = service;
//# sourceMappingURL=service.js.map