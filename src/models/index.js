"use strict";

module.exports = function(database) {
    return {
        Log: require("./log")(database)
    };
};
