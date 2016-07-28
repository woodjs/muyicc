"use strict";
let util = require('util');
let SuperModel = require('../common/SuperModel');

util.inherits(ArticleModel, SuperModel);

function ArticleModel(opts) {
   SuperModel.call(this, opts);
}

module.exports = ArticleModel;