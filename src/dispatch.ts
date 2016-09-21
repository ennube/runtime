
declare var __filename: string;

export const dispatchFileName = __filename;

export function dispatcher(event, context, callback) {
    callback(undefined, {
        content: `Hello from the sky`
     });
}
