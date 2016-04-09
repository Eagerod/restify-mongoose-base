"use strict";

var Controllers = require("./controllers");
var LogController = Controllers.LogController;
var StatusController = Controllers.StatusController;

var lumen = require("./lumina-config");


/**
    @class Router
    @classdesc The application's route generator. Sets up routes for each of the
    controllers that exist in the application.

    @property server {Restify} The restify server that the routes will all be
    configured on.
*/
function Router(server) {
    this.server = server;
}

/**
    @function Router#configureStatusController
    @desc Sets up routes for the status controller.

    @property /status {GET} Return 200.
    @property /database {GET} Checks the state of all Mongoose connections, and
    return a 200 if the database connections are all ready, 500 if any
    connection is down.
    @property /error {GET} Return an error.
    @property /exception {GET} Throw an exception.
    @property /echo {POST} Return the JSON object the user sends in.
*/
Router.prototype.configureStatusController = function() {
    this.server.get("/status", lumen.illuminate(StatusController.getStatus));
    this.server.get("/database", lumen.illuminate(StatusController.database));
    this.server.get("/error", lumen.illuminate(StatusController.manualError));
    this.server.get("/exception", lumen.illuminate(StatusController.manualException));
    this.server.post("/echo", lumen.illuminate(StatusController.echo));
};

Router.prototype.configureLogController = function() {
    this.server.get("/logs", lumen.illuminate(LogController.get));
};

module.exports = function(server) {
    var router = new Router(server);
    router.configureStatusController();
    router.configureLogController();
};
