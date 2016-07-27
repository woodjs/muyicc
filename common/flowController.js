var gu = require('guthrie-js');
var flowController = new gu.controller.create();

flowController.on('actionExecuting', function (req, res, next) {

  next();
});

module.exports = flowController;
