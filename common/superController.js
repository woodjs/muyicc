"use strict";

var gu = require('guthrie-js');
var flowController = require('./flowController');
var masterController = new gu.controller.inherit(flowController);

masterController.on('actionExecuting', function (req, res, next) {
  //(async function () {
  //
  //  console.log('1111');
  //})();

  async function () {
    "use strict";

    console.log(1111);

  }
  next();
});


module.exports = masterController;