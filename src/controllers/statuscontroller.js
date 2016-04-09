"use strict";

var mongoose = require("mongoose");
var restify = require("restify");

/**
    @class StatusController
    @classdesc Controller that provides a few useful status and error handling
    routes that can be used for making sure that the server is up and running,
    and also that different error handlers are logging the way that they should.
*/
var StatusController = module.exports;

/**
    @function StatusController#getStatus
    @desc Simple status handler

    @returns 200 and a JSON object.
*/
StatusController.getStatus = {
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
StatusController.manualError = {
    handler: function(req, res, next) {
        next(new restify.BadRequestError("I've made a huge mistake."));
    }
};

/**
    @function StatusController#manualException
    @desc Route that generates an uncaught exception inside a request handler.

    @throws An error that is handled by the restify uncaughtException handler.
*/
StatusController.manualException = {
    handler: function() {
        throw new Error("I've made a critical mistake.");
    }
};

/**
    @function StatusController#database
    @desc Get the current status of the database.
*/
StatusController.database = {
    handler: function(req, res, next) {
        var badConnections = mongoose.connections.filter(function(connection) {
            return connection.readyState !== 1;
        });

        if (badConnections.length) {
            req.log.error({
                msg: "Database connections failing",
                connections: badConnections.map(function(connection) {
                    return connection.host + ":" + connection.port;
                })
            });
            res.send(500);
            return next();
        }

        res.send(200);
        return next();
    }
};

/**
    @function StatusController#echo
    @desc Route that returns whatever the user sends in. This is used to test
    things like the server's media types.

    @returns The request body.
*/
StatusController.echo = {
    handler: function(req, res, next) {
        res.send(200, req.body);
        return next();
    }
};
