"use strict";

var request = require("request");

var app = require("..");

// Helper function to make testing http routes a little easier.
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
    "Start server": function retry(test) {
        if ( app.serving ) {
            return test.done();
        }
        setTimeout(retry.bind(this, test), 25);
    },
    "Status controller": {
        "Get status": function(test) {
            test.expect(2);
            apiCall({url: "http://localhost:8080/status", method: "GET"}, function(err, resp, body) {
                test.ifError(err);
                test.deepEqual(body, {
                    status: "All systems operational."
                });
                test.done();
            });
        },
        "Manual error": function(test) {
            test.expect(2);
            apiCall({url: "http://localhost:8080/error", method: "GET"}, function(err, resp, body) {
                test.ifError(err);
                test.deepEqual(body, {
                    code: "BadRequestError",
                    message: "I've made a huge mistake."
                });
                test.done();
            });
        },
        "Manual exception": function(test) {
            test.expect(2);
            apiCall({url: "http://localhost:8080/exception", method: "GET"}, function(err, resp, body) {
                test.ifError(err);
                test.deepEqual(body, {
                    code: "InternalError",
                    message: "I've made a critical mistake."
                });
                test.done();
            });
        }
    },
    "Shutdown server": function(test) {
        app.server.close(function() {
            test.done();
        });
    }
};
