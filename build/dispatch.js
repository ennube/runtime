"use strict";
exports.dispatchFileName = __filename;
function dispatcher(event, context, callback) {
    callback(undefined, {
        content: "Hello from the sky"
    });
}
exports.dispatcher = dispatcher;
//# sourceMappingURL=dispatch.js.map