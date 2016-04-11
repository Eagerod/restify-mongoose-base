"use strict";

var bunyan = require("bunyan");

var config = require("../config");
var Log = require("../models").Log;

/**
    @class LogController
    @classdesc Controller that sends out the system's logging information so
    that it can be used for debugging/alerting purposes.
*/
var LogController = module.exports;

/**
    @function LogController#get
    @desc Fetches logs for a given interval and with minimum log levels, and then
    returns them back grouped by request. 
    Returns logs in reverse chronological order.

    @returns An array of logs.
*/
LogController.get = {
    handler: function(req, res, next) {
        var level = bunyan.resolveLevel(req.query.level || config.DEFAULT_LOG_DOWNLOAD_LEVEL);
        var startTime = new Date();
        startTime.setTime(startTime.getTime() + (parseInt(req.query.start) || config.DEFAULT_LOG_DOWNLOAD_INTERVAL));
        var endTime = new Date();
        endTime.setTime(endTime.getTime() + parseInt(req.query.end || 0));

        Log.aggregate(
            {
                $match: {
                    requestId: {
                        $exists: 1
                    },
                    time: {
                        $gte: startTime,
                        $lte: endTime
                    }
                }
            },
            {
                $group: {
                    _id: {
                        request: "$requestId",
                        url: "$url"
                    },
                    items: {
                        $push: "$$ROOT"
                    }
                }
            },
            {
                $match: {
                    items: {
                        $elemMatch: {
                            level: {
                                $gte: level
                            }
                        }
                    }
                }
            },
            {
                $sort: {
                    "items.time": -1
                }
            },
            {
                $project: {
                    _id: 0,
                    id: "$_id.request",
                    url: "$_id.url",
                    logs: "$items"
                }
            },
            function(err, results) {
                if (err) {
                    return next(err);
                }

                // Remove unwanted stuff that the pipeline can't deal with:
                results = results.map(function(result) {
                    result.logs = result.logs.map(function(log) {
                        delete log.v;
                        delete log.__v;
                        delete log._id;
                        delete log.url;
                        delete log.requestId;
                        delete log.hostname;
                        delete log.name;
                        delete log.pid;
                        return log;
                    });
                    return result;
                });

                res.send(results);
                return next();
            }
        );
    }
};
