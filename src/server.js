"use strict";

var restify = require("restify");

var config = require("./config");

var server = restify.createServer({
    name: "Restify Server",
    version: "0.0.1"
});

// Some basic middleware that will either be needed, or be useful for any kind
// of moderate extending.
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser({rejectUnknown: true}));
server.use(restify.authorizationParser()); // If you're doing your own auth.
server.use(restify.CORS()); // eslint-disable-line new-cap

module.exports.server = server;

// Only start listening after db connection is open.
server.listen(config.PORT, function() {
    server.log.info("%s listening at %s", server.name, server.url);
    console.log("%s listening at %s", server.name, server.url);
    module.exports.serving = true;
});

// Different error logs of increasing severity.
server.on("after", function(req, res, route, err) {
    if ( err ) {
        server.log.warn(err);
    }
});

server.on("uncaughtException", function(req, res, route, err) {
    req.log.error(err);
    // Mimic the regular restify uncaught exception handler.
    res.send({
        code: "InternalError",
        message: err.message
    });
});

// istanbul ignore next: Would actually require killing tests, I think.
process.on("uncaughtException", function(exc) {
    server.log.fatal(exc);
    throw exc;
});

// Routes
require("./routes.js")(server);
