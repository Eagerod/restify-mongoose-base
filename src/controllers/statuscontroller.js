"use strict";

var restify = require("restify");

/**
    @class StatusController
    @classdesc Controller that provides a few useful status and error handling
    routes that can be used for making sure that the server is up and running,
    and also that different error handlers are logging the way that they should.
*/
function StatusController() {}

/**
    @function StatusController#getStatus
    @desc Simple status handler

    @returns 200 and a JSON object.
*/
StatusController.prototype.getStatus = {
    handler: function(req, res, next) {
        res.send(200, {status: "All systems operational."});
        return next();
    }
};

/**
    @function StatusController#manualError
    @desc Route that generates a handled error, and passes it through Restify's
    handler chain.

    @returns A restify-handled error as one would appear in normal running code.
*/
StatusController.prototype.manualError = {
    handler: function(req, res, next) {
        next(new restify.BadRequestError("I've made a huge mistake."));
    }
};

/**
    @function StatusController#manualException
    @desc Route that generates an uncaught exception inside a request handler.

    @throws An error that is handled by the restify uncaughtException handler.
*/
StatusController.prototype.manualException = {
    handler: function() {
        throw new Error("I've made a critical mistake.");
    }
};

module.exports = new StatusController();
