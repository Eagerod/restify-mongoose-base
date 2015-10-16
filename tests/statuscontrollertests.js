"use strict";

var utils = require("./testutils");

var apiCall = utils.apiCall;

module.exports = {
    "Get Status": function(test) {
        test.expect(2);
        apiCall({url: "http://localhost:8080/status", method: "GET"}, function(err, resp, body) {
            test.ifError(err);
            test.deepEqual(body, {
                status: "All systems operational."
            });
            test.done();
        });
    },
    "Manual Error": function(test) {
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
    "Manual Exception": function(test) {
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
};
