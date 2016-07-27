var os = require('os');
var config = require('../config');
var extendError = require('./extendError');

function initApp() {

  config.curServerName = os.hostname();

  extendError();

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

module.exports = initApp;