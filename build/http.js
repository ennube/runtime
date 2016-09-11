"use strict";
function http(_a) {
    return function (handler) {
        return function (event, context, cb) {
            var req = new Request();
            var res = new Response();
            return handler(req, res);
        };
    };
}
exports.http = http;
var Request = (function () {
    function Request() {
    }
    return Request;
}());
exports.Request = Request;
var Response = (function () {
    function Response() {
    }
    return Response;
}());
exports.Response = Response;
