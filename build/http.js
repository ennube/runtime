"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var service_1 = require('./service');
var http;
(function (http) {
    var Request = (function () {
        function Request(data) {
            this.data = data;
        }
        return Request;
    }());
    http.Request = Request;
    var Response = (function () {
        function Response(resolve) {
            this.resolve = resolve;
            this.statusCode = undefined;
            this.headers = {};
        }
        Response.prototype.send = function (body) {
            if (body === void 0) { body = null; }
            if (this.headers['Content-Type'] === undefined)
                this.headers['Content-Type'] = 'text/html; charset=utf-8';
            this.resolve({
                statusCode: this.statusCode,
                headers: this.headers,
                body: body
            });
        };
        Response.prototype.json = function (body) {
            if (this.headers['Content-Type'] === undefined)
                this.headers['Content-Type'] = 'application/json; charset=utf-8';
            this.resolve({
                statusCode: this.statusCode || 200,
                headers: this.headers,
                body: JSON.stringify(body)
            });
        };
        Response.prototype.end = function () {
            this.resolve({
                statusCode: this.statusCode || 204,
                headers: this.headers,
                body: null
            });
        };
        return Response;
    }());
    http.Response = Response;
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
        Gateway.prototype.ANY = function (url) {
            return this.endpointDecorator('ANY', url);
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