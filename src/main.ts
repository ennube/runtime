import {http} from './http';
import * as service from './service';

/*
    ENTRY POINT
*/

export function mainEntry(event, context, done) {

    if('httpMethod' in event)
        httpDispatcher(event, context)
        .then( (response) => done(null, response))
        .catch( (error) => done(null, {
            statusCode: 500,
            headers: {},
            body: `${error}`
        }))
    else
        done('unknow event source');

}

function httpDispatcher(event, context) {
    return new Promise( (resolve, reject) => {

        let gatewayName = event.stageVariables? event.stageVariables.gatewayName: 'web';
        if( gatewayName === undefined )
            throw new Error(`Undefined gateway`);

        let gateway = http.allGateways[gatewayName];
        if( gateway === undefined )
            throw new Error(`Undefined gateway '${gatewayName}'`);

        let httpMethods = gateway.endpoints[event.resource];
        if( httpMethods === undefined )
            throw new Error(`Unnable to route '${event.resource}''`);

        let endpoint = httpMethods[event.httpMethod];
        if( endpoint === undefined ) {
            endpoint = httpMethods['ANY'];
            if( endpoint === undefined )
                throw new Error(`Invalid method '${event.httpMethod}'`);
        }

        let request = new http.Request(event as http.RequestData);
        let response = new http.Response(resolve);

        let serviceInstance = service.Service.get(endpoint.serviceDescriptor.serviceClass);

        serviceInstance[endpoint.name](request, response);

    });
}
