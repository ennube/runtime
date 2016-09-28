"use strict";
var http_1 = require('./http');
function mainEntry(event, context, callback) {
    if ('httpMethod' in event) {
        try {
            var gatewayName = event.stageVariables ?
                event.stageVariables.gatewayName :
                http_1.http.Gateway.default();
            if (gatewayName === undefined)
                throw new Error("Undefined gateway");
            var gateway = http_1.http.allGateways[gatewayName];
            if (gateway === undefined)
                throw new Error("Undefined gateway '" + gatewayName + "'");
            gateway.dispatch(event)
                .then(function (v) { return callback(null, v); })
                .catch(function (e) { return callback(null, {
                statusCode: 500,
                headers: {},
                body: "CRITICAL ERROR (level 2)\n\t" + e + "\n" + e.stack
            }); });
        }
        catch (e) {
            callback(null, {
                statusCode: 500,
                headers: {},
                body: "CRITICAL ERROR (level 1)\n\t" + e + "\n" + e.stack
            });
        }
    }
    else
        callback(new Error('unknow event source'), null);
}
exports.mainEntry = mainEntry;
//# sourceMappingURL=main.js.map