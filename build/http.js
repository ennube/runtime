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
    function endpointDecorator(gateway, httpMethod, url) {
        return function (servicePrototype, handlerName, descriptor) {
            if (typeof servicePrototype == 'function')
                throw new Error((servicePrototype.name + "." + handlerName + "():") +
                    "static handlers are not permitted");
            var serviceClass = servicePrototype.constructor;
            var httpMethods = gateway.endpoints[url];
            if (httpMethods === undefined)
                httpMethods = gateway.endpoints[url] = {};
            httpMethods[httpMethod] = new Endpoint({
                serviceDescriptor: service_1.ServiceDescriptor.get(serviceClass),
                name: handlerName,
            });
        };
    }
    ;
    var Gateway = (function () {
        function Gateway(name, settings) {
            if (settings === void 0) { settings = {}; }
            this.name = name;
            this.endpoints = {};
            Object.assign(this, settings);
            http.allGateways[name] = this;
        }
        Gateway.default = function () {
            var gatewayNames = Object.getOwnPropertyNames(http.allGateways);
            if (gatewayNames.length > 0)
                return gatewayNames[0];
        };
        Gateway.get = function (name) {
            var gateway = http.allGateways[name];
            if (gateway === undefined)
                gateway = new Gateway(name);
            return gateway;
        };
        Gateway.prototype.ANY = function (url) {
            return endpointDecorator(this, 'ANY', url);
        };
        Gateway.prototype.HEAD = function (url) {
            return endpointDecorator(this, 'HEAD', url);
        };
        Gateway.prototype.GET = function (url) {
            return endpointDecorator(this, 'GET', url);
        };
        Gateway.prototype.POST = function (url) {
            return endpointDecorator(this, 'POST', url);
        };
        Gateway.prototype.PUT = function (url) {
            return endpointDecorator(this, 'PUT', url);
        };
        Gateway.prototype.PATCH = function (url) {
            return endpointDecorator(this, 'PATCH', url);
        };
        Gateway.prototype.OPTIONS = function (url) {
            return endpointDecorator(this, 'OPTIONS', url);
        };
        Gateway.prototype.DELETE = function (url) {
            return endpointDecorator(this, 'DELETE', url);
        };
        Gateway.prototype.dispatch = function (requestData) {
            var httpMethods = this.endpoints[requestData.resource];
            if (httpMethods === undefined)
                throw new Error("Unnable to route '" + requestData.resource + "'");
            var endpoint = httpMethods[requestData.httpMethod];
            if (endpoint === undefined) {
                endpoint = httpMethods['ANY'];
                if (endpoint === undefined)
                    throw new Error("Invalid method '" + requestData.httpMethod + "'");
            }
            var service = endpoint.serviceDescriptor.instance;
            return new Promise(function (resolve) {
                var request = new Request(requestData);
                var response = new Response(request, resolve);
                try {
                    service[endpoint.name](request, response);
                }
                catch (e) {
                    resolve({
                        statusCode: 500,
                        headers: {},
                        body: "CRITICAL ERROR (level 3)\n\t" + e + "\n" + e.stack
                    });
                }
            });
        };
        return Gateway;
    }());
    http.Gateway = Gateway;
    var Request = (function () {
        function Request(event) {
            this.method = event.httpMethod;
            this.path = event.path;
            this.headers = event.headers || {};
            this.params = event.pathParameters || {};
            this.query = event.queryStringParameters || {};
            if (this.get('Content-Type') == 'application/json')
                this.body = JSON.parse(event.body);
            else
                this.body = event.body;
        }
        Request.prototype.get = function (headerName) {
            return this.headers[headerName];
        };
        return Request;
    }());
    http.Request = Request;
    var Response = (function () {
        function Response(request, callback) {
            this.request = request;
            this.callback = callback;
            this.statusCode = undefined;
            this.headers = {};
        }
        Response.prototype.status = function (statusCode) {
            this.statusCode = statusCode;
            return this;
        };
        Response.prototype.send = function (body) {
            console.log('SENDING', body);
            if (this.headers['Content-Type'] === undefined)
                this.headers['Content-Type'] = 'text/html; charset=utf-8';
            this.callback({
                statusCode: this.statusCode || 200,
                headers: this.headers,
                body: body
            });
        };
        Response.prototype.json = function (body) {
            body = JSON.stringify(body);
            console.log('SENDING JSON', body);
            if (this.headers['Content-Type'] === undefined)
                this.headers['Content-Type'] = 'application/json; charset=utf-8';
            this.callback({
                statusCode: this.statusCode || 200,
                headers: this.headers,
                body: body
            });
        };
        Response.prototype.end = function () {
            this.callback({
                statusCode: this.statusCode || 204,
                headers: this.headers,
                body: ''
            });
        };
        return Response;
    }());
    http.Response = Response;
})(http = exports.http || (exports.http = {}));
//# sourceMappingURL=http.js.map