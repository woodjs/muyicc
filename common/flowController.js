var gu = require('guthrie-js');
var flowController = new gu.controller.create();

flowController.on('actionExecuting', function (req, res, next) {
  console.log(1111);
  next();
});

module.exports = flowController;
