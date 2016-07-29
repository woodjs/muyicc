"use strict";
let util = require('util');
let BaseModel = require('../common/BaseModel');

util.inherits(ArticleModel, BaseModel);

function ArticleModel(opts) {
   BaseModel.call(this, opts);
}

module.exports = ArticleModel;