/*
  log
  Schema for defining a log entry.
*/
"use strict";

var mongoose = require("mongoose");


/**
    @class Log
    @classdesc Completely empty schema to allow for whatever Bunyan wants.
*/
var logSchema = new mongoose.Schema({}, {strict: false});

module.exports = mongoose.model("Log", logSchema);
