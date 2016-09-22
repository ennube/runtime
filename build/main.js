"use strict";
var http_1 = require('./http');
var service = require('./service');
function mainEntry(event, context, done) {
    if ('httpMethod' in event)
        httpDispatcher(event, context)
            .then(function (response) { return done(null, response); })
            .catch(function (error) { return done(null, {
            statusCode: 500,
            headers: {},
            body: "" + error
        }); });
    else
        done('unknow event source');
}
exports.mainEntry = mainEntry;
function httpDispatcher(event, context) {
    return new Promise(function (resolve, reject) {
        var gatewayName = event.stageVariables ? event.stageVariables.gatewayName : 'web';
        if (gatewayName === undefined)
            throw new Error("Undefined gateway");
        var gateway = http_1.http.allGateways[gatewayName];
        if (gateway === undefined)
            throw new Error("Undefined gateway '" + gatewayName + "'");
        var httpMethods = gateway.endpoints[event.resource];
        if (httpMethods === undefined)
            throw new Error("Unnable to route '" + event.resource + "''");
        var endpoint = httpMethods[event.httpMethod];
        if (endpoint === undefined) {
            endpoint = httpMethods['ANY'];
            if (endpoint === undefined)
                throw new Error("Invalid method '" + event.httpMethod + "'");
        }
        var request = new http_1.http.Request(event);
        var response = new http_1.http.Response(resolve);
        var serviceInstance = service.Service.get(endpoint.serviceDescriptor.serviceClass);
        serviceInstance[endpoint.name](request, response);
    });
}
//# sourceMappingURL=main.js.map