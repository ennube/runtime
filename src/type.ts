
export interface Type extends Function {

}

export function typeOf(value: any): Type {
    if(value === undefined)
        return undefined;

    if(value === null)
        return null;

    return Object.getPrototypeOf(value).constructor;

}

export interface Class<T> extends Type {
    new(...args: any[]): T;
}


/*
function getBaseClass(type: Class): Type {
    return Object.getPrototypeOf(type.prototype).constructor;
}

function isSubType(subType: Function, baseType: Function) {
    return subType.prototype instanceof baseType;
}
*/
