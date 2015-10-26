"use strict";

module.exports = {
    "Get Status": function(test) {
        test.expect(2);
        this.apiCall({url: "http://localhost:8080/status", method: "GET"}, function(err, resp, body) {
            test.ifError(err);
            test.deepEqual(body, {
                status: "All systems operational."
            });
            test.done();
        });
    },
    "Manual Error": function(test) {
        test.expect(2);
        this.apiCall({url: "http://localhost:8080/error", method: "GET"}, function(err, resp, body) {
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
        this.apiCall({url: "http://localhost:8080/exception", method: "GET"}, function(err, resp, body) {
            test.ifError(err);
            test.deepEqual(body, {
                code: "InternalError",
                message: "I've made a critical mistake."
            });
            test.done();
        });
    },
    "Echo": {
        "Success": function(test) {
            test.expect(2);
            this.apiCall({url: "http://localhost:8080/echo", method: "POST", json: {"a": "b"}}, function(err, resp, body) {
                test.ifError(err);
                test.deepEqual(body, {a: "b"});
                test.done();
            });
        },
        "Content-Type failure": function(test) {
            test.expect(3);
            this.apiCall({url: "http://localhost:8080/echo", method: "POST", body: "{\"a\": \"b\"}"}, function(err, resp, body) {
                test.ifError(err);
                test.deepEqual(resp.statusCode, 415);
                test.deepEqual(body, {
                    code: "UnsupportedMediaTypeError",
                    message: "application/octet-stream"
                });
                test.done();
            });
        }
    }
};
