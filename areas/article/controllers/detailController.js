"use strict";

let co = require('co');
let gu = require('guthrie-js');
let superController = require('../../../common/superController');
let ArticleModel = require('../../../models/article/ArticleModel');
let detailController = new gu.controller.inherit(superController);

detailController.actions = {
  read: {
    GET: function* (req, res) {
      let article = new ArticleModel();

      res.render('article/index');
    }
  }

};

module.exports = detailController;