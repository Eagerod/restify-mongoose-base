"use strict";

var mock = require("nodeunit-mock");
var uuid = require("node-uuid");

var app = require("../../..");

var LogControllerTests = module.exports;
var LogTests = LogControllerTests["GET /logs"] = {};

LogTests.setUp = function(done) {
    var self = this;
    // Write some logs that will and won't be aggregated into certain requests.
    // Need requestId, because we only seek request logs.
    // Logs are written way too quickly without any extra waiting. Add in 2 ms
    // of delay so that the timestamps actually end up different.

    // Only debug logs
    var log = app.server.log.child({requestId: uuid.v4()});
    log.debug("A debug log!");
    setTimeout(function() {
        log.debug("Another debug log!");
    }, 2);

    // A debug and an info
    setTimeout(function() {
        var log = app.server.log.child({requestId: uuid.v4()});
        log.debug("A debug log!");
        setTimeout(function() {
            log.info("An info log!");
        }, 2);
    }, 4);

    // An info and a warn
    setTimeout(function() {
        var log = app.server.log.child({requestId: uuid.v4()});
        log.info("An info log!");
        setTimeout(function() {
            log.warn("A warning log!");

            self.waitForLogs(done);
        }, 2);
    }, 8);
};

LogTests["Success"] = function(test) {
    test.expect(3);

    this.apiCall("http://localhost:8080/logs", function(err, resp, body) {
        test.ifError(err);
        test.equal(body.length, 2);

        var expectedMessages = [
            ["An info log!", "A warning log!"],
            ["A debug log!", "An info log!"]
        ];

        var messages = body.map(function(request) {
            return request.logs.map(function(log) {
                return log.msg;
            });
        });

        test.deepEqual(expectedMessages, messages);
        test.done();
    });
};

LogTests["Success Level Provided"] = function(test) {
    test.expect(3);

    this.apiCall("http://localhost:8080/logs?level=debug", function(err, resp, body) {
        test.ifError(err);
        test.equal(body.length, 3);

        var expectedMessages = [
            ["An info log!", "A warning log!"],
            ["A debug log!", "An info log!"],
            ["A debug log!", "Another debug log!"]
        ];

        var messages = body.map(function(request) {
            return request.logs.map(function(log) {
                return log.msg;
            });
        });

        test.deepEqual(expectedMessages, messages);
        test.done();
    });
};

LogTests["Database Error"] = function(test) {
    var Log = this.database.models.Log;

    test.expect(3);

    mock(test, Log, "aggregate", function() {
        var args = Array.prototype.slice.call(arguments);
        var callback = args[args.length - 1];
        callback(new Error("Failed to database"));
    });

    this.apiCall("http://localhost:8080/logs", function(err, resp, body) {
        test.ifError(err);
        test.equal(resp.statusCode, 500);
        test.deepEqual(body, {
            message: "Failed to database"
        });
        test.done();
    });
};
