"use strict";

var async = require("async");
var bunyan = require("bunyan");
var MongooseObjectStream = require("mongoose-object-stream");
var request = require("request");

var app = require("..");
var config = require("../src/config");

var Models = require("../src/models");
var Log = Models.Log;

if ( process.env.PORT ) {
    throw new Error("Cannot use custom port for test execution.");
}
if ( !config.DEBUG ) {
    throw new Error("Must be in debug mode for tests.");
}

// Helper function to make testing HTTP routes a little easier.
function apiCall(reqObj, callback) {
    request(reqObj, function(err, resp, body) {
        if ( typeof body === "string" && body.length > 0 ) {
            if ( body[0] === "{" || body[0] === "[" ) {
                body = JSON.parse(body);
            }
        }
        return callback(err, resp, body);
    });
}

// Helper function to kill off all models in the database.
function removeAllModels(callback) {
    var models = app.database ? app.database.base.models : [];
    if ( models.length && app.database.db.s.databaseName !== "testdatabase" ) { // Sanity check, really
        throw new Error("Tests being run on non test environment.");
    }
    async.each(models, function(model, cb) {
        model.remove({}, cb);
    }, callback);
}

// Somewhat hacky function that recreates the application logger in the event that a particular test depends on certain
// logs being present.
// Calls back when the logger has been ended, has finished writing all outstanding logs, and recreated.
function waitForLogs(callback) {
    app.logStream.on("finish", function() {
        app.logStream = new MongooseObjectStream(Log);

        app.server.log = bunyan.createLogger({
            name: "example-logger",
            level: "debug",
            stream: app.logStream
        });

        callback();
    });
    app.logStream.end();
}

// The first and last tests in this file are a little weird, since they don't
// actually test anything, but they take care of starting and stopping the
// server. Because of the way nodeunit runs tests in the order they're defined,
// it's perfectly predictable that they will be the first and last tests to run.
module.exports = {
    "setUp": function(done) {
        this.apiCall = apiCall;
        this.waitForLogs = waitForLogs;

        removeAllModels(done);
    },
    "Start Server": function retry(test) {
        if ( app.serving ) {
            return test.done();
        }
        setTimeout(retry.bind(this, test), 25);
    },
    "Status Controller": require("./src/controllers/statuscontrollertests"),
    "Log Controller": require("./src/controllers/logcontrollertests"),
    "Shutdown Server": function(test) {
        app.server.close(function() {
            // Because logs are still being written to the database from the bunyan logger, end the logger so there
            // are no flows that are trying to write to the DB asynchronously.
            app.logStream.on("finish", function() {
                app.database.close(function() {
                    test.done();
                });
            });
            app.logStream.end();
        });
    }
};
