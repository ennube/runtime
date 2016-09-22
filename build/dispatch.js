"use strict";
function mainEntry(event, context, done) {
    if ('httpMethod' in event)
        httpDispatcher(event, context)
            .then(function (response) { return done(null, response); })
            .catch(function (error) { return done(null, {
            statusCode: 500,
            headers: {},
            body: error
        }); });
    else
        done('unknow event source');
}
exports.mainEntry = mainEntry;
function httpDispatcher(event, context) {
    return new Promise(function (resolve, reject) {
        resolve(JSON.stringify({
            event: event,
            context: context,
            env: process.env
        }));
    });
}
//# sourceMappingURL=dispatch.js.map