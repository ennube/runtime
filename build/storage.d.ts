export declare namespace storage {
    type AccessControl = "AuthenticatedRead" | "AwsExecRead" | "BucketOwnerRead" | "BucketOwnerFullControl" | "LogDeliveryWrite" | "Private" | "PublicRead" | "PublicReadWrite";
    const accessControl: {
        AuthenticatedRead: AccessControl;
        AwsExecRead: AccessControl;
        BucketOwnerRead: AccessControl;
        BucketOwnerFullControl: AccessControl;
        LogDeliveryWrite: AccessControl;
        Private: AccessControl;
        PublicRead: AccessControl;
        PublicReadWrite: AccessControl;
    };
    const allBuckets: {
        [name: string]: Bucket;
    };
    interface BucketParams {
        name: string;
        staged?: boolean;
        versioning?: boolean;
        extern?: boolean;
        accessControl?: AccessControl;
    }
    class Bucket implements BucketParams {
        name: string;
        staged: boolean;
        versioning: boolean;
        extern: boolean;
        accessControl: "Private";
        protected client: any;
        constructor(params: BucketParams);
    }
}
