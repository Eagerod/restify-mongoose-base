"use strict";

var request = require("request");

var app = require("..");


// Helper function to make testing HTTP routes a little easier.
function apiCall(reqObj, callback) {
    request(reqObj, function(err, resp, body) {
        if ( typeof body === "string" && body.length > 0 ) {
            body = JSON.parse(body);
        }
        return callback(err, resp, body);
    });
}


// The first and last tests in this file are a little weird, since they don't
// actually test anything, but they take care of starting and stopping the
// server. Because of the way nodeunit runs tests in the order they're defined,
// it's perfectly predictable that they will be the first and last tests to run.
module.exports = {
    "setUp": function(done) {
        this.apiCall = apiCall;
        done();
    },
    "Start Server": function retry(test) {
        if ( app.serving ) {
            return test.done();
        }
        setTimeout(retry.bind(this, test), 25);
    },
    "Status Controller": require("./src/controllers/statuscontrollertests"),
    "Shutdown Server": function(test) {
        app.server.close(function() {
            test.done();
        });
    }
};
