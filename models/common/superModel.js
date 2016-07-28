"use strict";
let doRequest = require('../../core/doRequest');
let config = require('../../config');
let defaultOptions = {
  server: null,
  method: 'GET',
  contentType: 'application/json'
};

function SuperModel(options) {
  let self = this;
  let defaultOptions = Object.assign(defaultOptions, options);

  this.get = function (opts) {

    let tempOpts = Object.assign(defaultOptions, opts);

    return new Promise(function (resolve, reject) {
     execute(tempOpts, resolve, reject);
    });
  };

}

function execute(opts, resolve, reject) {
  doRequest(opts, function (response, body) {
    if (opts.res) {
      resolve(response);
    } else {
      res.status(response && response.statusCode || 200);
      resolve(body, response)
    }
  }, reject);
}


module.exports = SuperModel;