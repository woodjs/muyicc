"use strict";
var util = require('util');
var SuperModel = require('../common/SuperModel');

util.inherits(ArticleModel, SuperModel);

function ArticleModel(opts) {
  SuperModel.call(this, opts);
}

module.exports = ArticleModel;