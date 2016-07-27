var gu = require('guthrie-js');
var superController = require('../../../common/superController');
var selectorController = new gu.controller.inherit(superController);

selectorController.actions = {
  index: {
    GET: function (req, res) {

      res.send({});
    }
  }
};

module.exports = selectorController;