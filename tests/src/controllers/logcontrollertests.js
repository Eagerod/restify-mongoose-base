"use strict";

var bunyan = require("bunyan");
var mock = require("nodeunit-mock");
var uuid = require("node-uuid");
var MongooseObjectStream = require("mongoose-object-stream");

var app = require("../../..");
var Models = require("../../../src/models");
var Log = Models.Log;

var LogControllerTests = module.exports;
var LogTests = LogControllerTests["GET /logs"] = {};

LogTests.setUp = function(done) {
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

            app.logStream.on("finish", function() {
                // More hax. Have to recreate the stream each time through, because the stream has been ended.
                app.logStream = new MongooseObjectStream(Log);

                app.server.log = bunyan.createLogger({
                    name: "example-logger",
                    level: "debug",
                    stream: app.logStream
                });

                done();
            });
            app.logStream.end();
        }, 2);
    }, 8);
};

LogTests["Success"] = function(test) {
    var self = this;
    test.expect(3);

    self.apiCall("http://localhost:8080/logs", function(err, resp, body) {
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
    var self = this;
    test.expect(3);

    self.apiCall("http://localhost:8080/logs?level=debug", function(err, resp, body) {
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
    var self = this;
    test.expect(3);

    mock(test, Log, "aggregate", function() {
        var args = Array.prototype.slice.call(arguments);
        var callback = args[args.length - 1];
        callback(new Error("Failed to database"));
    });

    self.apiCall("http://localhost:8080/logs", function(err, resp, body) {
        test.ifError(err);
        test.equal(resp.statusCode, 500);
        test.deepEqual(body, {
            message: "Failed to database"
        });
        test.done();
    });
};
