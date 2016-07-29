var gu = require('guthrie-js');
var baseController = require('../../../common/baseController');
var homeController = new gu.controller.inherit(baseController);

homeController.actions = {
  index: {
    GET: function (req, res) {

      res.send({});
    }
  }
};

module.exports = homeController;