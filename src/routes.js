"use strict";

var Controllers = require("./controllers");

var lumen = require("./lumina-config");


/**
    @class Router
    @classdesc The application's route generator. Sets up routes for each of the
    controllers that exist in the application.

    @property server {Restify} The restify server that the routes will all be
    configured on.
*/
function Router(server, database) {
    this.server = server;
    this.database = database;
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
    var statusController = new Controllers.StatusController(this.database);

    this.server.get("/status", lumen.illuminate(statusController.getStatus()));
    this.server.get("/database", lumen.illuminate(statusController.databaseStatus()));
    this.server.get("/error", lumen.illuminate(statusController.manualError()));
    this.server.get("/exception", lumen.illuminate(statusController.manualException()));
    this.server.post("/echo", lumen.illuminate(statusController.echo()));
};

Router.prototype.configureLogController = function() {
    var logController = new Controllers.LogController(this.database);

    this.server.get("/logs", lumen.illuminate(logController.get()));
};

module.exports = function(server, database) {
    var router = new Router(server, database);
    router.configureStatusController();
    router.configureLogController();
};
