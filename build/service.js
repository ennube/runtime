"use strict";
exports.allServices = {};
exports.serviceInstances = {};
function ensureService(serviceClass) {
    var serviceId = serviceClass.name;
    var service = exports.allServices[serviceId];
    if (service === undefined)
        service = exports.allServices[serviceId] = {
            serviceClass: serviceClass,
            memoryLimit: 256,
            timeLimit: 6,
        };
    return service;
}
exports.ensureService = ensureService;
function serviceDecorator(params) {
    return function (serviceClass) {
        var service = ensureService(serviceClass);
        Object.assign(service, params);
    };
}
exports.serviceDecorator = serviceDecorator;
//# sourceMappingURL=service.js.map