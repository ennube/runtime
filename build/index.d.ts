import 'core-js';
export * from './service';
export * from './type';
export { http } from './http';
export { storage } from './storage';
import * as _handler from './handler';
export declare const handler: typeof _handler;
