"use strict";

let gu = require('guthrie-js');
let flowController = new gu.controller.create();

flowController.on('actionExecuting', function (req, res, next) {
  this.viewBag().data = 'yyl';

  next();
});

module.exports = flowController;
