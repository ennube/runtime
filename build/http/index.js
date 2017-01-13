"use strict";
var service_1 = require("../service");
exports.allGateways = {};
;
;
/*
    Gateway
 */
function endpointDecorator(gateway, httpMethod, url, data) {
    return function (servicePrototype, handlerName, descriptor) {
        if (typeof servicePrototype == 'function')
            throw new Error(servicePrototype.name + "." + handlerName + "():" +
                "static handlers are not permitted");
        var serviceClass = servicePrototype.constructor;
        var httpMethods = gateway.endpoints[url];
        if (httpMethods === undefined)
            httpMethods = gateway.endpoints[url] = {};
        httpMethods[httpMethod] = {
            serviceDescriptor: service_1.ServiceDescriptor.get(serviceClass),
            name: handlerName,
            data: data
        };
    };
}
;
var Gateway = (function () {
    function Gateway(name, settings) {
        if (settings === void 0) { settings = {}; }
        this.name = name;
        this.endpoints = {};
        this.middlewares = new Array();
        Object.assign(this, settings);
        exports.allGateways[name] = this;
    }
    Gateway.default = function () {
        var gatewayNames = Object.getOwnPropertyNames(exports.allGateways);
        if (gatewayNames.length > 0)
            return gatewayNames[0];
    };
    //static get default() {}
    Gateway.get = function (name) {
        var gateway = exports.allGateways[name];
        if (gateway === undefined)
            gateway = new Gateway(name);
        return gateway;
    };
    Gateway.prototype.ANY = function (url, data) {
        return endpointDecorator(this, 'ANY', url, data);
    };
    Gateway.prototype.HEAD = function (url, data) {
        return endpointDecorator(this, 'HEAD', url, data);
    };
    Gateway.prototype.GET = function (url, data) {
        return endpointDecorator(this, 'GET', url, data);
    };
    Gateway.prototype.POST = function (url, data) {
        return endpointDecorator(this, 'POST', url, data);
    };
    Gateway.prototype.PUT = function (url, data) {
        return endpointDecorator(this, 'PUT', url, data);
    };
    Gateway.prototype.PATCH = function (url, data) {
        return endpointDecorator(this, 'PATCH', url, data);
    };
    Gateway.prototype.OPTIONS = function (url, data) {
        return endpointDecorator(this, 'OPTIONS', url, data);
    };
    Gateway.prototype.DELETE = function (url, data) {
        return endpointDecorator(this, 'DELETE', url, data);
    };
    Gateway.prototype.use = function (middleware) {
        this.middlewares.push(middleware);
    };
    //dispatch(requestData: RequestData, responseCallback: (ResponseData) => void) {
    Gateway.prototype.dispatch = function (requestData) {
        var _this = this;
        var httpMethods = this.endpoints[requestData.resource];
        if (httpMethods === undefined)
            throw new Error("Unnable to route '" + requestData.resource + "'");
        var endpoint = httpMethods[requestData.httpMethod];
        if (endpoint === undefined) {
            // HANDLE OPTIONS
            if (requestData.httpMethod == 'OPTIONS') {
                return Promise.resolve({
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Methods': Object.getOwnPropertyNames(httpMethods).toString(),
                    },
                    body: ''
                });
            }
            endpoint = httpMethods['ANY'];
            if (endpoint === undefined)
                throw new Error("Invalid method '" + requestData.httpMethod + "'");
        }
        var service = endpoint.serviceDescriptor.instance;
        // AMBOS, req & res, comparten un objeto
        return new Promise(function (resolve) {
            var req = new Request(requestData, endpoint.data);
            var res = new Response(req, resolve);
            var index = 0;
            var next = function () {
                try {
                    // call middleware
                    if (index < _this.middlewares.length) {
                        var middleware = _this.middlewares[index];
                        index += 1;
                        middleware(req, res, next);
                    }
                    else {
                        service[endpoint.name](req, res);
                    }
                }
                catch (e) {
                    resolve({
                        statusCode: 500,
                        headers: {},
                        body: "CRITICAL ERROR (level 3)\n\t" + e + "\n" + e.stack
                    });
                }
            };
            next();
        });
    };
    return Gateway;
}());
exports.Gateway = Gateway;
/*
function mapPromises<T>(list: T[], callback: (v: T) => Promise<any>): Promise<any> {
    if( list.length == 0 )
        return Promise.resolve();

    let p = callback(list.shift()) || Promise.resolve();
    return p.then(() => mapPromises(list, callback));
}
*/
var Request = (function () {
    function Request(event, data) {
        this.method = event.httpMethod;
        this.path = event.path;
        this.headers = event.headers || {};
        this.params = event.pathParameters || {};
        this.query = event.queryStringParameters || {};
        this.body = event.body;
        this.data = data; // endpoint data
    }
    Request.prototype.get = function (headerName) {
        return this.headers[headerName];
    };
    Request.prototype.json = function () {
        return JSON.parse(this.body);
    };
    return Request;
}());
exports.Request = Request;
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
        if (this.headers['Content-Type'] === undefined)
            this.headers['Content-Type'] = 'application/json; charset=utf-8';
        this.callback({
            statusCode: this.statusCode || 200,
            headers: this.headers,
            body: body
        });
    };
    Response.prototype.error = function (error) {
        if (this.headers['Content-Type'] === undefined)
            this.headers['Content-Type'] = 'application/json; charset=utf-8';
        this.callback({
            statusCode: 500,
            headers: {},
            body: error
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
exports.Response = Response;
//# sourceMappingURL=index.js.map