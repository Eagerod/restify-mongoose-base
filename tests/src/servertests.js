"use strict";

var ServerTests = module.exports;
var LogTests = ServerTests["Request Logging"] = {};

LogTests["Records Request Information"] = function(test) {
    var Log = this.database.models.Log;

    var self = this;

    test.expect(10);
    var headers = {
        "User-Agent": "Test Runner"
    };

    this.apiCall({url: "http://localhost:8080/logs", headers: headers}, function(err, resp, body) {
        test.ifError(err);
        test.equal(resp.statusCode, 200);
        test.deepEqual(body, []);

        // After the request has completed, the webserver records a log containing info about the request.
        self.waitForLogs(function() {
            Log.find({}, function(err, logs) {
                test.ifError(err);
                test.equal(logs.length, 1);

                var log = logs[0].toObject();
                test.ok(log.duration > 0);
                test.equal(log.statusCode, 200);
                test.equal(log.method, "GET");
                test.equal(log.url, "/logs");
                test.equal(log.userAgent, "Test Runner");
                test.done();
            });
        });
    });
};
