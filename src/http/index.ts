import { HandlerDescriptor,
         HandlerDescriptorParams,
         ServiceDescriptor } from '../service';


export const allGateways: {
    [gatewayId:string]: Gateway
} = { };


export interface EndpointParams extends HandlerDescriptorParams {

};

export interface Endpoint extends HandlerDescriptor {
    data?: any;
};


export interface RequestData {
    httpMethod: string;
    resource: string;
    path: string;
    pathParameters: {
        [param:string]: string
    };
    queryStringParameters: {
        [queryParam:string]: string
    };
    headers: {
        [headerName:string]: string
    };

    stageVariables: {
        [headerName:string]: string
//            gatewayName: string;
    };

    requestContext?: {
        accountId: string;
        resourceId: string;
        stage: string;
        requestId: string;
        identity: {
            cognitoIdentityPoolId: string;
            accountId: string;
            cognitoIdentityId: string;
            caller: string;
            apiKey: string;
            sourceIp: string;
            cognitoAuthenticationType: string;
            cognitoAuthenticationProvider: string;
            userArn: string;
            userAgent: string;
            user: string;
        };
        resourcePath: string;
        httpMethod: string;
        apiId: string;
    };

    body: string;
}

export interface ResponseData {
    statusCode: number;
    headers: {
        [headerName:string]: string
    };
    body: string;
}


/*
    Gateway
 */


 function endpointDecorator(gateway:Gateway, httpMethod:string, url:string, data) {

     return (servicePrototype: any,
             handlerName: string,
             descriptor: PropertyDescriptor) => {

         if( typeof servicePrototype == 'function' )
             throw new Error(`${servicePrototype.name}.${handlerName}():` +
                             `static handlers are not permitted`);

         let serviceClass = servicePrototype.constructor;

         let httpMethods = gateway.endpoints[url];
         if( httpMethods === undefined)
             httpMethods = gateway.endpoints[url] = {}

         httpMethods[httpMethod] = {
             serviceDescriptor: ServiceDescriptor.get(serviceClass),
             name: handlerName,
             data
         };

     };
 }



 export interface GatewaySettings {
     /*
     */
 };

 export type Middleware = (req: Request, res: Response, next: ()=>void) => void;

 export class Gateway {

    static default(){
        let gatewayNames = Object.getOwnPropertyNames(allGateways);
        if( gatewayNames.length > 0 )
            return gatewayNames[0]
    }

    //static get default() {}


    static get(name: string) {

        let gateway = allGateways[name];
        if( gateway === undefined )
            gateway = new Gateway(name);

        return gateway;
    }


    constructor(public name: string, settings: GatewaySettings={}) {
        Object.assign(this, settings);
        allGateways[name] = this;
    }

    endpoints: {
        [url:string]: {
            [httpMethod:string]: Endpoint
        }
    } = { };

    ANY(url: string, data?) {
        return endpointDecorator(this, 'ANY', url, data);
    }

    HEAD(url: string, data?) {
        return endpointDecorator(this, 'HEAD', url, data);
    }

    GET(url: string, data?) {
        return endpointDecorator(this, 'GET', url, data);
    }

    POST(url: string, data?) {
        return endpointDecorator(this, 'POST', url, data);
    }

    PUT(url: string, data?) {
        return endpointDecorator(this, 'PUT', url, data);
    }

    PATCH(url: string, data?) {
        return endpointDecorator(this, 'PATCH', url, data);
    }

    OPTIONS(url: string, data?) {
        return endpointDecorator(this, 'OPTIONS', url, data);
    }

    DELETE(url: string, data?) {
        return endpointDecorator(this, 'DELETE', url, data);
    }


    middlewares = new Array<Middleware>();

    use(middleware: Middleware) {
        this.middlewares.push(middleware);
    }


    //dispatch(requestData: RequestData, responseCallback: (ResponseData) => void) {
    dispatch(requestData: RequestData) {

        let httpMethods = this.endpoints[requestData.resource];
        if( httpMethods === undefined )
            throw new Error(`Unnable to route '${requestData.resource}'`);

        let endpoint = httpMethods[requestData.httpMethod];
        if( endpoint === undefined ) {
            // HANDLE OPTIONS
            if(requestData.httpMethod == 'OPTIONS') {
                return Promise.resolve(<ResponseData> {
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Headers': '*',
                        'Access-Control-Allow-Methods': Object.getOwnPropertyNames(httpMethods).toString(), // TODO: ANY fuera..
                    },
                    body: ''
                })
            }

            endpoint = httpMethods['ANY'];
            if( endpoint === undefined )
                throw new Error(`Invalid method '${requestData.httpMethod}'`);
        }

        let service = endpoint.serviceDescriptor.instance;

        // AMBOS, req & res, comparten un objeto

        return new Promise( (resolve) => {
            let req = new Request(requestData, endpoint.data);
            let res = new Response(req, resolve);

            let index = 0;

            let next = () => {
                try {
                    // call middleware
                    if( index < this.middlewares.length ) {
                        let middleware = this.middlewares[index];
                        index += 1;
                        middleware(req, res, next);
                    }
                    // call handler
                    else {
                        service[endpoint.name](req, res);
                    }

                }
                catch(e) {
                    resolve( <ResponseData> {
                        statusCode: 500,
                        headers: {},
                        body: `CRITICAL ERROR (level 3)\n\t${e}\n${e.stack}`
                    })
                }
            };
            next();
        });
    }
}

/*
function mapPromises<T>(list: T[], callback: (v: T) => Promise<any>): Promise<any> {
    if( list.length == 0 )
        return Promise.resolve();

    let p = callback(list.shift()) || Promise.resolve();
    return p.then(() => mapPromises(list, callback));
}
*/


export class Request {
    method: string;
    path: string;
    params: { [headerName:string]: string };
    query: { [headerName:string]: string };
    headers: { [headerName:string]: string };
    body: string;
    data: any;

    constructor(event: RequestData, data: any) {
        this.method = event.httpMethod;
        this.path = event.path;
        this.headers = event.headers || {};
        this.params = event.pathParameters || {};
        this.query = event.queryStringParameters || {};
        this.body = event.body;
        this.data = data; // endpoint data
    }

    get(headerName: string) {
        return this.headers[headerName];
    }

    json(): any {
        return JSON.parse(this.body)
    }

}



export class Response {
    statusCode: number = undefined;
    headers: {} = {};

    constructor(protected request:Request, protected callback) {

    }

    status(statusCode: number) {
        this.statusCode = statusCode;
        return this;
    }

    send(body:string) {
        if( this.headers['Content-Type'] === undefined )
            this.headers['Content-Type'] = 'text/html; charset=utf-8';

        this.callback({
            statusCode: this.statusCode || 200,
            headers: this.headers,
            body: body
        });

    }

    json(body:any) {
        body = JSON.stringify(body);
        if( this.headers['Content-Type'] === undefined )
            this.headers['Content-Type'] = 'application/json; charset=utf-8';

        this.callback({
            statusCode: this.statusCode || 200,
            headers: this.headers,
            body: body
        });

    }

    error(error:any) {

        if( this.headers['Content-Type'] === undefined )
            this.headers['Content-Type'] = 'application/json; charset=utf-8';

        this.callback({
            statusCode: 500,
            headers: {},
            body: error
        });

    }


    end() {
        this.callback({
            statusCode: this.statusCode || 204,
            headers: this.headers,
            body: ''
        });
    }

}
