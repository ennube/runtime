 /*
    exports as http handler decorator,
    wrap the handler for http usage,
    provides req, res
 */

export function http({
//    paths: { [key:string]: string[] }
}) {

    return (handler) => { // decorator

        return (event, context, cb) => { // wrapper

            let req = new Request();
            let res = new Response();

            return handler(req, res) // passtrought

        };
    };

}



export class Request
{

}

export class Response {

}
