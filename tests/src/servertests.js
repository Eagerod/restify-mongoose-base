"use strict";

var bunyan = require("bunyan");
var mock = require("nodeunit-mock");
var uuid = require("node-uuid");
var MongooseObjectStream = require("mongoose-object-stream");

var app = require("../..");
var Models = require("../../src/models");
var Log = Models.Log;

var ServerTests = module.exports;
var LogTests = ServerTests["Logging"] = {};

LogTests["Records Request Information"] = function(test) {
    this.apiCall("http://localhost:8080/logs", function(err, resp, body) {
        test.ifError(err);
        test.equal(resp.statusCode, 200);
        test.deepEqual(body, []);

        // After the request has completed, the webserver records a log containing info about the request.
        app.logStream.on("finish", function() {
            // More hax. Have to recreate the stream each time through, because the stream has been ended.
            app.logStream = new MongooseObjectStream(Log);

            app.server.log = bunyan.createLogger({
                name: "example-logger",
                level: "debug",
                stream: app.logStream
            });

            Log.find({}, function(err, logs) {
                test.ifError(err);
                test.equal(logs.length, 1);

                var log = logs[0];
                console.log(logs);
                test.equal(log.statusCode, 200);
                test.equal(log.method, "GET");
                test.equal(log.route, "/logs");

                test.done();
            })
        });
        app.logStream.end();
    });
};
