"use strict";

var StatusControllerTests = module.exports;
var SystemConfigTests = StatusControllerTests["System Config"] = {};
var EchoTests = StatusControllerTests["Echo"] = {};

SystemConfigTests["Get Status"] = function(test) {
    test.expect(2);
    this.apiCall({url: "http://localhost:8080/status", method: "GET"}, function(err, resp, body) {
        test.ifError(err);
        test.deepEqual(body, {
            status: "All systems operational."
        });
        test.done();
    });
};

SystemConfigTests["Manual Error"] = function(test) {
    test.expect(2);
    this.apiCall({url: "http://localhost:8080/error", method: "GET"}, function(err, resp, body) {
        test.ifError(err);
        test.deepEqual(body, {
            code: "BadRequestError",
            message: "I've made a huge mistake."
        });
        test.done();
    });
};

SystemConfigTests["Manual Exception"] = function(test) {
    test.expect(2);
    this.apiCall({url: "http://localhost:8080/exception", method: "GET"}, function(err, resp, body) {
        test.ifError(err);
        test.deepEqual(body, {
            code: "InternalError",
            message: "I've made a critical mistake."
        });
        test.done();
    });
};

EchoTests["Success"] = function(test) {
    test.expect(2);
    this.apiCall({url: "http://localhost:8080/echo", method: "POST", json: {"a": "b"}}, function(err, resp, body) {
        test.ifError(err);
        test.deepEqual(body, {a: "b"});
        test.done();
    });
};

EchoTests["Failure Content-Type Incorrect"] = function(test) {
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
};
