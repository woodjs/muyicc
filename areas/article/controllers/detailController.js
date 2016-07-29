"use strict";

let co = require('co');
let gu = require('guthrie-js');
let baseController = require('../../../common/baseController');
let ArticleModel = require('../../../models/article/ArticleModel');
let detailController = new gu.controller.inherit(baseController);

detailController.actions = {
  read: {
    GET: function* (req, res) {

      let article = new ArticleModel();

      res.render('article/index');
    }
  }

};

module.exports = detailController;