export declare namespace storage {
    type AccessControl = "AuthenticatedRead" | "AwsExecRead" | "BucketOwnerRead" | "BucketOwnerFullControl" | "LogDeliveryWrite" | "Private" | "PublicRead" | "PublicReadWrite";
    const AccessControl: {
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
    class Bucket {
        name: string;
        accessControl: AccessControl;
        staged: boolean;
        constructor(name: string, accessControl?: AccessControl, staged?: boolean);
    }
}
