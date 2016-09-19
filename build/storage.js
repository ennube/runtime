"use strict";
var storage;
(function (storage) {
    storage.AccessControl = {
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
    var Bucket = (function () {
        function Bucket(name, accessControl, staged) {
            if (accessControl === void 0) { accessControl = storage.AccessControl.Private; }
            if (staged === void 0) { staged = true; }
            this.name = name;
            this.accessControl = accessControl;
            this.staged = staged;
            storage.allBuckets[name] = this;
        }
        return Bucket;
    }());
    storage.Bucket = Bucket;
    var deploymentBucket = new Bucket('deployment', storage.AccessControl.Private, false);
})(storage = exports.storage || (exports.storage = {}));
//# sourceMappingURL=storage.js.map