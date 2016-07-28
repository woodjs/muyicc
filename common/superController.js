"use strict";
var gu = require('guthrie-js');
var flowController = require('./flowController');
var masterController = new gu.controller.inherit(flowController);

masterController.on('actionExecuting', function (req, res, next) {
  console.log(2222);
  next();
});


module.exports = masterController;