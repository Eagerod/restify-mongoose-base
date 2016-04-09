"use strict";

var Lumina = require("lumina");
var LuminaMongoose = require("lumina-mongoose");

var lumen = new Lumina();
lumen.use("requiredHeaders", Lumina.requiredHeaderValidator());
lumen.use("requiredBodyFields", Lumina.requiredBodyFieldValidator());
lumen.use("restrictedBodyFields", Lumina.restrictedBodyFieldValidator());

lumen.use("fetchObjectsFromRoute", LuminaMongoose.fetchObjectsFromRoute());

module.exports = lumen;
