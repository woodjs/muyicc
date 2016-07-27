var gu = require('guthrie-js');
var superController = require('../../../common/superController');
var detailController = new gu.controller.inherit(superController);

detailController.actions = {
  read: {
    GET: function (req, res) {

      res.render('article/index', {});
    }
  }
};

module.exports = detailController;