"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var service_1 = require('./service');
var http;
(function (http) {
    http.allGateways = {};
    ;
    var Endpoint = (function (_super) {
        __extends(Endpoint, _super);
        function Endpoint() {
            _super.apply(this, arguments);
        }
        return Endpoint;
    }(service_1.HandlerDescriptor));
    http.Endpoint = Endpoint;
    ;
    var Gateway = (function () {
        function Gateway(name) {
            this.name = name;
            this.endpoints = {};
            http.allGateways[name] = this;
        }
        Gateway.get = function (name) {
            var gateway = http.allGateways[name];
            if (gateway === undefined)
                gateway = new Gateway(name);
            return gateway;
        };
        Gateway.prototype.endpointDecorator = function (httpMethod, url) {
            var _this = this;
            return function (servicePrototype, handlerName, descriptor) {
                if (typeof servicePrototype == 'function')
                    throw new Error((servicePrototype.name + "." + handlerName + "():") +
                        "static handlers are not permitted");
                var serviceClass = servicePrototype.constructor;
                var httpMethods = _this.endpoints[url];
                if (httpMethods === undefined)
                    httpMethods = _this.endpoints[url] = {};
                httpMethods[httpMethod] = new Endpoint({
                    serviceDescriptor: service_1.ServiceDescriptor.get(serviceClass),
                    name: handlerName,
                });
            };
        };
        Gateway.prototype.GET = function (url) {
            return this.endpointDecorator('GET', url);
        };
        Gateway.prototype.POST = function (url) {
            return this.endpointDecorator('POST', url);
        };
        Gateway.prototype.PUT = function (url) {
            return this.endpointDecorator('PUT', url);
        };
        Gateway.prototype.DELETE = function (url) {
            return this.endpointDecorator('DELETE', url);
        };
        return Gateway;
    }());
    http.Gateway = Gateway;
})(http = exports.http || (exports.http = {}));
//# sourceMappingURL=http.js.map