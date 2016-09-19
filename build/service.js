"use strict";
exports.serviceClasses = {};
exports.serviceInstances = {};
function registerServiceClass(serviceClass) {
    exports.serviceClasses[serviceClass.name] = serviceClass;
}
exports.registerServiceClass = registerServiceClass;
//# sourceMappingURL=service.js.map