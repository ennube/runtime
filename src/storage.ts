const aws = require('aws-sdk');

export namespace storage {

    export type AccessControl =
        "AuthenticatedRead" |
        "AwsExecRead" |
        "BucketOwnerRead" |
        "BucketOwnerFullControl" |
        "LogDeliveryWrite" |
        "Private" |
        "PublicRead" |
        "PublicReadWrite";

    export const accessControl = {
        AuthenticatedRead: "AuthenticatedRead" as AccessControl,
        AwsExecRead: "AwsExecRead" as AccessControl,
        BucketOwnerRead: "BucketOwnerRead" as AccessControl,
        BucketOwnerFullControl: "BucketOwnerFullControl" as AccessControl,
        LogDeliveryWrite: "LogDeliveryWrite" as AccessControl,
        Private: "Private" as AccessControl,
        PublicRead: "PublicRead" as AccessControl,
        PublicReadWrite: "PublicReadWrite" as AccessControl,
    };

    export const allBuckets: {
        [name:string]: Bucket
    } = { };

    export interface BucketParams {
        name: string;
        staged?: boolean;
        versioning?: boolean;
        extern?: boolean; // the bucket is out of the stack.
        accessControl?: AccessControl;
    };

    export class Bucket implements BucketParams {
        name: string;
        staged: boolean=  false;
        versioning: boolean = false;
        extern: boolean = false;
        accessControl: "Private";

        protected client: any;

        constructor(params: BucketParams) {
            if( params.name in allBuckets )
                throw new Error(`Bucket ${params.name} name duplicated`);

            Object.assign(this, params);
            allBuckets[params.name] = this;

            this.client = aws.S3();
        }

        

    }

}
