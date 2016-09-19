"use strict";
function typeOf(value) {
    if (value === undefined)
        return undefined;
    if (value === null)
        return null;
    return Object.getPrototypeOf(value).constructor;
}
exports.typeOf = typeOf;
//# sourceMappingURL=type.js.map