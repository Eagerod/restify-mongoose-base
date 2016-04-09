"use strict";

/**
    @class Config
    @classdesc Holds configuration variables that can be used throughout the
    application, so that only this file needs to touch <code>process.env</code>.

    @property DEBUG {Boolean} Whether or not the application is running in debug mode.
    Defaults to false.
    @property PORT {Integer} The port that the application will serve on.
    Defaults to 8080.
    @property DATABASE {String} The database connection string for the application's MongoDB instance.
    Defaults to a local database called "testdatabase"
    @property DEFAULT_LOG_LEVEL {String} The minimum default level that log are shown in the logs controller
    Defaults to 'info'
    @property DEFAULT_LOG_INTERVAL {String} The number of seconds to seek back in time for log search.
    Defaults to 1 hour.
*/

var config = module.exports;

// istanbul ignore next: The || false gets missed, because always debug.
config.DEBUG = process.env.DEBUG || false;

config.PORT = process.env.PORT || 8080;

config.DATABASE = process.env.DATABASE || "localhost:27017/testdatabase";

config.DEFAULT_LOG_LEVEL = "info";
config.DEFAULT_LOG_INTERVAL = -(60 * 60 * 1000);
