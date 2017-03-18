"use strict";

var mongoose = require("mongoose");
var mock = require("nodeunit-mock");

var StatusControllerTests = module.exports;
var SystemConfigTests = StatusControllerTests["System Config"] = {};
var EchoTests = StatusControllerTests["Echo Routes"] = {};
var DatabaseTests = StatusControllerTests["Database Routes"] = {};

SystemConfigTests["Get Status"] = function(test) {
    test.expect(3);

    this.apiCall({url: "http://localhost:8080/status", method: "GET"}, function(err, resp, body) {
        test.ifError(err);
        test.equal(resp.statusCode, 200);
        test.deepEqual(body, {
            status: "All systems operational."
        });
        test.done();
    });
};

SystemConfigTests["Manual Error"] = function(test) {
    test.expect(3);

    this.apiCall({url: "http://localhost:8080/error", method: "GET"}, function(err, resp, body) {
        test.ifError(err);
        test.equal(resp.statusCode, 400);
        test.deepEqual(body, {
            code: "BadRequestError",
            message: "I've made a huge mistake."
        });
        test.done();
    });
};

SystemConfigTests["Manual Exception"] = function(test) {
    test.expect(3);

    this.apiCall({url: "http://localhost:8080/exception", method: "GET"}, function(err, resp, body) {
        test.ifError(err);
        test.equal(resp.statusCode, 500);
        test.deepEqual(body, {
            code: "InternalError",
            message: "I've made a critical mistake."
        });
        test.done();
    });
};

EchoTests["Success"] = function(test) {
    test.expect(3);

    this.apiCall({url: "http://localhost:8080/echo", method: "POST", json: {"a": "b"}}, function(err, resp, body) {
        test.ifError(err);
        test.equal(resp.statusCode, 200);
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

DatabaseTests["Success"] = function(test) {
    test.expect(3);

    this.apiCall("http://localhost:8080/database", function(err, resp, body) {
        test.ifError(err);
        test.equal(resp.statusCode, 200);
        test.equal(body, "");
        test.done();
    });
};

DatabaseTests["Connections Failing"] = function(test) {
    test.expect(3);

    mock(test, mongoose.connections, "filter", function() {
        return mongoose.connections.map(function(connection) {
            return {readyState: 2, host: connection.host, port: connection.port};
        });
    });

    this.apiCall("http://localhost:8080/database", function(err, resp, body) {
        test.ifError(err);
        test.equal(resp.statusCode, 500);
        test.equal(body, "");

        test.done();
    });
};

DatabaseTests["Connections Error"] = function(test) {
    var Log = this.database.models.Log;

    test.expect(1);
    mock(test, Log, "find", function(callback) {
        mongoose.connections[0].emit("error");
        callback(new Error("Error emitted"));
    });

    Log.find(function(err) {
        test.ok(err);
        test.done();
    });
};
