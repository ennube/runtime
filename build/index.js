"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
require('core-js');
__export(require('./service'));
__export(require('./type'));
var http_1 = require('./http');
exports.http = http_1.http;
var storage_1 = require('./storage');
exports.storage = storage_1.storage;
var dispatch_1 = require('./dispatch');
exports.dispatcher = dispatch_1.dispatcher;
exports.dispatchFileName = dispatch_1.dispatchFileName;
//# sourceMappingURL=index.js.map