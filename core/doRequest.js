"use strict";

var fs = require('fs');
var request = require('request');
var env = process.env.NODE_ENV || 'development';

if (env === 'test') {
  request = request.defaults({'proxy': 'http://navigator.servision.com.cn:8888'});
}

function doRequest(opts, callback) {

  if (!opts.server && !opts.url) {
    return;
  }

  var options = {
    host: opts.server && opts.server.host,
    port: (opts.server && opts.server.port) || '',
    requestPrefix: (opts.server && opts.server.requestPrefix) || '',
    path: opts.path,
    method: opts.method || 'GET'
  };

  var url = opts.url || 'http://' + options.host + (options.port ? ':' + options.port : '') + options.requestPrefix + options.path;

  if (opts.headers) {
    options.headers = opts.headers;
    options.headers['X-USERID'] = opts.userId || opts.req.session.userId || '';
  } else {
    options.headers = {
      'content-type': opts.contentType || 'application/json',
      'X-USERID': opts.userId || opts.req.session.userId || ''
    };
  }

  if (opts.files) {

    var multipart = [];
    var props = Object.keys(opts.files);

    if (opts.data) {
      multipart.push({
        'content-type': 'application/json',
        'body': typeof opts.data === 'string' ? opts.data : JSON.stringify(opts.data)
      });
    }

    props.forEach(function (prop) {
      if (opts.files[prop].name) {
        var filename = opts.files[prop].name;
        var obj = {
          'content-type': opts.files[prop].type,
          'content-disposition': 'form-data; name=' + prop + '; filename=' + filename,
          'body': fs.createReadStream(opts.files[prop].path)
        };

        multipart.push(obj);
      }
    });

    var multipartOptions = {
      uri: encodeURI(url),
      method: options.method,
      headers: {
        'X-USERID': options.headers['X-USERID']
      },
      multipart: multipart
    };

    if (opts.res) {

      request(multipartOptions)
        .on('error', function (err) {
          err.publish();
          return opts.res.send({
            success: false,
            message: '后端服务连接错误！'
          });
        })
        .pipe(createResponseObj(opts.res, callback) || opts.res);

    } else {

      request(multipartOptions, createResponseHandle(callback));

    }
  } else {

    var data = null;

    if (opts.data) {
      data = typeof opts.data === 'string' ? opts.data : JSON.stringify(opts.data);
    }

    var normalOptions = {
      url: encodeURI(url),
      method: options.method,
      headers: options.headers,
      body: data
    };

    if (opts.res) {

      request(normalOptions)
        .on('error', function (err) {
          err.publish();
          return opts.res.send({
            success: false,
            message: '后端服务连接错误！'
          });
        })
        .pipe(createResponseObj(opts.res, callback) || opts.res);

    } else {

      request(normalOptions, createResponseHandle(callback));

    }
  }
}

function createResponseObj(res, callback) {

  return callback && typeof callback === 'function' ? callback(res) : res;

}

function createResponseHandle(callback) {

  return function (err, res, body) {

    if (err) {
      err.publish();
      return callback(res, {
        success: false,
        message: '后端服务错误！'
      });
    }

    if (res.statusCode === 404) {
      return callback(res, {
        success: false,
        message: '后端服务404错误！'
      });
    }

    if (res && res.headers && res.headers['content-disposition']) {
      return callback(res, body);
    }

    if (body) {

      try {
        body = typeof body === 'string' ? JSON.parse(body) : body;
      } catch (e) {
        var temp = body;
        body = {};
        body.result = temp;
      }


      body.success = (res && res.statusCode <= 299) ? true : false;
    } else {

      body = {};
      body.success = (res && res.statusCode <= 299) ? true : false;
    }
    callback(res, body);
  };
}

module.exports = doRequest;