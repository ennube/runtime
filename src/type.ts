
export type Type = Function; // Type is a constructor function

export function typeOf(value: any): Type {
    if(value === undefined)
        return undefined;

    if(value === null)
        return null;

    return Object.getPrototypeOf(value).constructor;
}

/*
export interface Class<T> extends Type {
    new(): Instance<T>;
}

export interface Instance<T> extends Object {

}
*/


/*
function getBaseClass(type: Class): Type {
    return Object.getPrototypeOf(type.prototype).constructor;
}

function isSubType(subType: Function, baseType: Function) {
    return subType.prototype instanceof baseType;
}


function foo(){}
*/
