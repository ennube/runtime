"use strict";
exports.serviceClasses = {};
exports.serviceInstances = {};
var ServiceRecord = (function () {
    function ServiceRecord(serviceClass) {
        this.serviceClass = serviceClass;
    }
    return ServiceRecord;
}());
exports.ServiceRecord = ServiceRecord;
exports.allServiceRecords = {};
exports.instances = {};
function getServiceRecord(serviceClass) {
    var service = exports.allServiceRecords[serviceClass.name];
    if (service === undefined)
        service = exports.allServiceRecords[serviceClass.name] = new ServiceRecord(serviceClass);
    return service;
}
exports.getServiceRecord = getServiceRecord;
//# sourceMappingURL=service.js.map