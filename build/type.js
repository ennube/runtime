"use strict";
function typeOf(value) {
    if (value === undefined)
        return undefined;
    if (value === null)
        return null;
    return Object.getPrototypeOf(value).constructor;
}
exports.typeOf = typeOf;
function instanceOf(value, type) {
    if (value === undefined)
        return type === undefined;
    if (value === null)
        return type === null;
    return Object.getPrototypeOf(value).constructor === type;
}
exports.instanceOf = instanceOf;
//# sourceMappingURL=type.js.map