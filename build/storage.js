"use strict";
var aws = require('aws-sdk');
var storage;
(function (storage) {
    storage.accessControl = {
        AuthenticatedRead: "AuthenticatedRead",
        AwsExecRead: "AwsExecRead",
        BucketOwnerRead: "BucketOwnerRead",
        BucketOwnerFullControl: "BucketOwnerFullControl",
        LogDeliveryWrite: "LogDeliveryWrite",
        Private: "Private",
        PublicRead: "PublicRead",
        PublicReadWrite: "PublicReadWrite",
    };
    storage.allBuckets = {};
    ;
    var Bucket = (function () {
        function Bucket(params) {
            this.staged = false;
            this.versioning = false;
            this.extern = false;
            if (params.name in storage.allBuckets)
                throw new Error("Bucket " + params.name + " name duplicated");
            Object.assign(this, params);
            storage.allBuckets[params.name] = this;
            this.client = aws.S3();
        }
        return Bucket;
    }());
    storage.Bucket = Bucket;
})(storage = exports.storage || (exports.storage = {}));
//# sourceMappingURL=storage.js.map