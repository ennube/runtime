/// <reference types="core-js" />
export interface Type extends Function {
}
export declare function typeOf(value: any): Type;
export interface Class<T> extends Type {
    new (...args: any[]): T;
}