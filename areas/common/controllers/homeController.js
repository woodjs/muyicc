var gu = require('guthrie-js');
var superController = require('../../../common/superController');
var homeController = new gu.controller.inherit(superController);

homeController.actions = {
  index: {
    GET: function (req, res) {

      res.send({});
    }
  }
};

module.exports = homeController;