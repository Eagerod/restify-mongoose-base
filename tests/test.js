"use strict";

var app = require("..");


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
    "Status controller": require("./statuscontrollertests"),
    "Shutdown server": function(test) {
        app.server.close(function() {
            test.done();
        });
    }
};
