"use strict";

var Controllers = require("./controllers");
var StatusController = Controllers.StatusController;

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
    @property /error {GET} Return an error.
    @property /exception {GET} Throw an exception.
*/
Router.prototype.configureStatusController = function() {
    this.server.get("/status", StatusController.getStatus.handler);
    this.server.get("/error", StatusController.manualError.handler);
    this.server.get("/exception", StatusController.manualException.handler);
};

module.exports = function(server) {
    var router = new Router(server);
    router.configureStatusController();
};
