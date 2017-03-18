"use strict";

var restify = require("restify");

/**
    @class StatusController
    @classdesc Controller that provides a few useful status and error handling
    routes that can be used for making sure that the server is up and running,
    and also that different error handlers are logging the way that they should.
*/

/**
    @function StatusController#getStatus
    @desc Simple status handler

    @returns 200 and a JSON object.
*/
function getStatusHandler(req, res, next) {
    res.status(200);
    res.send({status: "All systems operational."});
    return next();
}

/**
    @function StatusController#manualError
    @desc Route that generates a handled error, and passes it through Restify's
    handler chain.

    @returns A restify-handled error as one would appear in normal running code.
*/
function manualErrorHandler(req, res, next) {
    next(new restify.BadRequestError("I've made a huge mistake."));
}

/**
    @function StatusController#manualException
    @desc Route that generates an uncaught exception inside a request handler.

    @throws An error that is handled by the restify uncaughtException handler.
*/
function manualExceptionHandler() {
    throw new Error("I've made a critical mistake.");
}

/**
    @function StatusController#database
    @desc Get the current status of the database.
*/
function databaseStatusHandler(req, res, next) {
    var badConnections = this.database.base.connections.filter(function(connection) {
        return connection.name && connection.readyState !== 1;
    });

    if (badConnections.length) {
        req.log.error({
            msg: "Database connections failing",
            connections: badConnections.map(function(connection) {
                return connection.host + ":" + connection.port;
            })
        });
        res.status(500);
        res.end();
        return next();
    }

    res.status(200);
    res.send();
    return next();
}

/**
    @function StatusController#echo
    @desc Route that returns whatever the user sends in. This is used to test
    things like the server's media types.

    @returns The request body.
*/
function echoHandler(req, res, next) {
    res.status(200);
    res.send(req.body);
    return next();
}

function StatusController(database) {
    this.database = database;
}

StatusController.prototype.getStatus = function() {
    return {
        handler: getStatusHandler.bind(this)
    };
};

StatusController.prototype.manualError = function() {
    return {
        handler: manualErrorHandler.bind(this)
    };
};

StatusController.prototype.manualException = function() {
    return {
        handler: manualExceptionHandler.bind(this)
    };
};

StatusController.prototype.databaseStatus = function() {
    return {
        handler: databaseStatusHandler.bind(this)
    };
};

StatusController.prototype.echo = function() {
    return {
        handler: echoHandler.bind(this)
    };
};

module.exports = StatusController;
