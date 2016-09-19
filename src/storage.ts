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

    export const AccessControl = {
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

    export class Bucket {
        constructor(public name: string,
                    public accessControl: AccessControl = AccessControl.Private,
                    public staged = true) {

            allBuckets[name] = this;
        }
    }

    const deploymentBucket = new Bucket('deployment',
        AccessControl.Private, false);

}
