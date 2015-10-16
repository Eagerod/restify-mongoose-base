"use strict";

var request = require("request");

// Helper function to make testing http routes a little easier.
function apiCall(reqObj, callback) {
    request(reqObj, function(err, resp, body) {
        if ( typeof body === "string" && body.length > 0 ) {
            body = JSON.parse(body);
        }
        return callback(err, resp, body);
    });
}

module.exports.apiCall = apiCall;
