"use strict";

/**
    @class Config
    @classdesc Holds configuration variables that can be used throughout the
    application, so that only this file needs to touch <code>process.env</code>.

    @property DEBUG {Boolean} Whether or not the application is running in debug
    mode.
    Defaults to false.
    @property PORT {Integer} The port that the application will serve on.
    Defaults to 8080.
*/

var config = module.exports;

// istanbul ignore next: The || false gets missed, because always debug.
config.DEBUG = process.env.DEBUG || false;

config.PORT = process.env.PORT || 8080;
