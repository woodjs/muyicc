"use strict";

var gu = require('guthrie-js');
var flowController = require('./flowController');
var baseController = new gu.controller.inherit(flowController);

baseController.on('actionExecuting', function (req, res, next) {
  next();
});


module.exports = baseController;