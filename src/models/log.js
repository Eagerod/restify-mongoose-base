/*
  log
  Schema for defining a log entry.
*/
"use strict";

var util = require("util");

var mongoose = require("mongoose");

/**
    @class Log
    @classdesc Schema that provides a couple indexes where allowed for bunyan logs.
*/
function LogSchema() {
    mongoose.Schema.call(this, {}, {strict: false});

    this.add({
        level: {type: Number, index: true},
        time: {type: Date, index: true}
    });
}

util.inherits(LogSchema, mongoose.Schema);

module.exports = function(database) {
    return database.model("Log", new LogSchema());
};
