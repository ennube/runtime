import * as http from './http';
import * as service from './service';

/*
    ENTRY POINT
*/

//export declare type Calback = (Error, {}) => void;

export function mainEntry(event, context, callback: (Error, {}) => void ) {

    if('httpMethod' in event) {
        // http.dispath
        try {
            let gatewayName = event.stageVariables?
                event.stageVariables.gatewayName:
                http.Gateway.default();

            if( gatewayName === undefined )
                throw new Error(`Undefined gateway`);

            let gateway = http.allGateways[gatewayName];
            if( gateway === undefined )
                throw new Error(`Undefined gateway '${gatewayName}'`);

/*
            gateway.dispatch(event, (response: http.ResponseData) =>
                done(null, response)
            );
*/
            gateway.dispatch(event)
            .then( (v) => callback(null, v) )
            .catch( (e) => callback(null, {
                statusCode: 500,
                headers: {},
                body: `CRITICAL ERROR (level 2)\n\t${e}\n${e.stack}`
            }))
            //httpDispatcher(event, context, done);
        }
        catch(e) {
            callback(null, {
                statusCode: 500,
                headers: {},
                body: `CRITICAL ERROR (level 1)\n\t${e}\n${e.stack}`
            });
        }
    }
    else
        callback(new Error('unknow event source'), null);

}
