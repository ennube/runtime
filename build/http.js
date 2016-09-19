"use strict";
var service_1 = require('./service');
var http;
(function (http) {
    http.allGateways = {};
    var Gateway = (function () {
        function Gateway() {
            this.endpoints = {};
        }
        return Gateway;
    }());
    http.Gateway = Gateway;
    var Endpoint = (function () {
        function Endpoint() {
        }
        return Endpoint;
    }());
    http.Endpoint = Endpoint;
    function endpointDecorator(gatewayId, url, method) {
        return function (servicePrototype, handlerMethod, descriptor) {
            if (typeof servicePrototype == 'function')
                throw new Error((servicePrototype.name + "." + handlerMethod + "():") +
                    "static handlers are not permitted");
            var serviceClass = servicePrototype.constructor;
            var gateway = http.allGateways[gatewayId];
            if (gateway === undefined)
                gateway = http.allGateways[gatewayId] = new Gateway();
            var methods = gateway.endpoints[url];
            if (methods === undefined)
                methods = gateway.endpoints[url] = {};
            var endpoint = methods[method];
            if (endpoint === undefined)
                endpoint = methods[method] = new Endpoint();
            service_1.registerServiceClass(serviceClass);
            endpoint.serviceClass = serviceClass;
            endpoint.handlerMethod = handlerMethod;
        };
    }
    function GET(gatewayId, url) {
        return endpointDecorator(gatewayId, url, 'get');
    }
    http.GET = GET;
    function POST(gatewayId, url) {
        return endpointDecorator(gatewayId, url, 'post');
    }
    http.POST = POST;
    function PUT(gatewayId, url) {
        return endpointDecorator(gatewayId, url, 'put');
    }
    http.PUT = PUT;
    function DELETE(gatewayId, url) {
        return endpointDecorator(gatewayId, url, 'delete');
    }
    http.DELETE = DELETE;
    function authorizer() {
    }
    http.authorizer = authorizer;
})(http = exports.http || (exports.http = {}));
//# sourceMappingURL=http.js.map