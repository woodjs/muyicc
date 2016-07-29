var gu = require('guthrie-js');
var baseController = require('../../../common/baseController');
var selectorController = new gu.controller.inherit(baseController);

selectorController.actions = {
  index: {
    GET: function (req, res) {

      res.send({});
    }
  }
};

module.exports = selectorController;