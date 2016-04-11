/*
  log
  Schema for defining a log entry.
*/
"use strict";

var mongoose = require("mongoose");


/**
    @class Log
    @classdesc Schema that provides a couple indexes where allowed for bunyan logs.
*/
var logSchema = new mongoose.Schema({
    level: {type: Number, index:true}
}, {strict: false});

module.exports = mongoose.model("Log", logSchema);
