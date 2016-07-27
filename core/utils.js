"use strict";

var fs = require('fs');
var path = require('path');
var util = require('util');
var formidable = require('formidable');
var serverConfig = require('../config');
var utils = {};

/**
 * 映射数据
 *
 * @param {Object} source
 * @param {Array} mapModel
 * mapModel = [['a', 'b'], ['abc.a', 'www.b']];
 * mapModel数组中每个数组项的第一个值为原对象的属性，第二个值是目标对象的属性
 * @return {Object} target
 */
utils.mappingData = function (source, mapModel) {
  var target = {};

  if (mapModel && mapModel.forEach) {
    for (var i = 0; i < mapModel.length; i++) {
      var tempModel = mapModel[i];
      var value = eval('source.' + tempModel[0]);
      var props = tempModel[1].split('.');

      createObj(target, 0, props, value);
    }

    return target;
  } else {
    return source;
  }

  function createObj(obj, index, arr, value) {
    if (index === arr.length - 1) {
      return obj[arr[index]] = value;
    } else {
      if (!obj[arr[index]]) {
        obj[arr[index]] = {};
      }

      return createObj(obj[arr[index]], index + 1, arr, value);
    }
  }
};

/**
 * 解析文件上传请求
 *
 * @param {Object} req
 * 普通的request对象
 * @param {Object} opts
 * {
 *  uploadDir: '...',
 *  keepExtensions: true | false
 * }
 * @param callback
 */
utils.parseUploadRequest = function (req, opts, callback) {
  var form = new formidable.IncomingForm();

  if (opts) {
    form.uploadDir = opts.uploadDir || path.join(__dirname, '../upload/');
    form.keepExtensions = opts.keepExtensions || true;
  }

  form.parse(req, function (err, fields, files) {
    if (err) {
      callback(true);
      err.publish();
    } else {
      callback(false, fields, files);
    }
  });
};

/**
 * 删除文件
 *
 * @param {Array | String} arr
 */
utils.removeFile = function (arr) {
  if (util.isArray(arr)) {
    for (var i = 0; i < arr.length; i++) {
      fs.unlink(arr[i], function (err) {
        err && err.publish();
      });
    }
  } else {
    fs.unlink(arr, function (err) {
      err && err.publish();
    });
  }
};

/**
 * 删除使用formidable模块上传的文件
 *
 * @param {Object} files
 */
utils.removeUploadFile = function (files) {
  var props = Object.keys(files);

  props.forEach(function (prop) {
    files[prop].path && utils.removeFile(files[prop].path);
  });
};

/**
 * 转换查询对象格式为新定义的后端查询接口
 *
 * @param {String} data
 * {
 *   filters: { "name": "test", "age": 16 },
 *   sorts: [{ "filed": "name", "asc": true }, { "field": "age", "asc": false }],
 *   paging: { "page": 3, "size": 10 }
 * }
 * @param {Object} opts
 * {
 *   name1: {opt: 'eq', type: 'string'},
 *   name2: {opt: 'neq', type: 'date'}
 * }
 *
 * @returns {Object}
 */
utils.toServerQueryObject = function (queryString, opts) {
  var data = JSON.parse(queryString);
  var obj = {};
  var filterObj = data.filters;

  obj.page = data.paging && data.paging.page;
  obj.limit = data.paging && data.paging.size;
  obj.sort = data.sorts;
  obj.filters = [];

  var propList = Object.keys(filterObj);

  propList.forEach(function (prop) {
    var temp = {};

    temp.left = prop;
    temp.right = filterObj[prop];
    temp.opt = 'eq';
    temp.type = '';

    if (opts && opts[prop]) {
      temp.opt = opts[prop].opt || 'eq';
      temp.type = opts[prop].type || '';
    }

    obj.filters.push(temp);
  });

  return obj;
};

/**
 * 得到要删除项的code集合
 *
 * @param {String} arrStr
 */
utils.getCodeList = function (arrStr) {
  var list = [];
  var arr = typeof arrStr === 'object' ? arrStr : JSON.parse(arrStr);

  arr.forEach(function (item) {
    if (item.code) {
      list.push(item.code);
    }
  });

  return list;
};

/**
 * 判断对象是否为空
 *
 * @param {Object} obj
 */
utils.isEmptyObject = function (obj) {
  for (var prop in obj) {
    return false;
  }

  return true;
};

/**
 * 向token中掺入字符串
 *
 * @param {String} token
 * @return {String}
 */
utils.inflateToken = function (token) {
  if (token && typeof token === 'string') {

    if (token.length > 10) {

      return token.replace(/(.{10})/, '$1' + utils.getTokenSalt());

    } else { //原始token不合法
      return token;
    }

  } else {
    return '';
  }
};

/**
 * 从token中清除掺入的字符串
 *
 * @param {String} token
 * @return {String}
 */
utils.deflateToken = function (token) {
  return token.replace(/(.{10}).{6}/, '$1');
};

/**
 * 获取需要掺入的字符串
 *
 * @return {String}
 */
utils.getTokenSalt = function () {
  return serverConfig.tokenSaltList[Math.floor(Math.random() * serverConfig.tokenSaltList.length)];
};

/**
 * 验证token合法性
 *
 * @param {String} token
 * @return {Boolean}
 */
utils.isRightToken = function (token) {
  if (token && typeof token === 'string' && token.length > 10) {

    return serverConfig.tokenSaltList.indexOf(token.slice(10, 16)) !== -1;

  } else {
    return false;
  }
};

/**
 * 替换url的协议 域名 端口号
 *
 * @param {String} url
 * @param {String} protocol
 * @param {String} host
 * @param {String | Number} port
 * @return {String}
 */
utils.getReplaceUrl = function (url, protocol, host, port) {
  var pattern = new RegExp('^(.*:)//([A-Za-z0-9\-\.]+)(:[0-9]+)?(.*)$');
  var urlPiece = url.split(pattern);
  var protocol = protocol ? protocol + '://' : urlPiece[1] + '//' || '';
  var host = host ? host : urlPiece[2] || '';
  var port = port ? ':' + port : urlPiece[3] || '';
  var path = urlPiece[4] || '';

  return protocol + host + port + path;
};

/**
 * 验证单文件大小类型
 */
utils.checkUploadFile = function (files, options, res) {
  var name = options.name;
  var type = files[name].type;
  var size = files[name].size;

  if (size) {
    if (options.maxSize && size >= options.maxSize) {
      utils.removeUploadFile(files);
      res.send(JSON.stringify({
        success: false,
        message: options.sizeMessage
      }));

      return false;
    }
    if (options.type && !utils.checkUploadFileType(type, options.type)) {
      utils.removeUploadFile(files);

      res.send(JSON.stringify({
        success: false,
        message: options.typeMessage
      }));

      return false;
    }
  }
  return true;
};

/**
 * 验证多文件
 */
utils.checkMultipleUploadFile = function (files, options, res) {
  for (var i in files) {
    if (files[i]['size'] > options.maxSize) {
      res.send(JSON.stringify({
        success: false,
        message: options.sizeMessage
      }));
      utils.removeUploadFile(files);
      return false;
    }
  }
  return true;
};

/**
 * 验证上传文件的总大小
 */
utils.checkUploadFileTotalSize = function (files, options, res) {
  var count = 0;

  Object.keys(files).forEach(function (key) {
    count = count + files[key].size;
  });

  if (count > options.maxSize) {
    res.send(JSON.stringify({
      success: false,
      message: options.sizeMessage
    }));
    utils.removeUploadFile(files);
    return false;
  }

  return true;
};

/**
 * 设置cookie与会话的期限
 *
 * @param {Object} req
 * @param {Object} res
 */
utils.rememberCookie = function (res, req) {
  var ms = 2 * 3600 * 24 * 1000;

  if (req.session.remember) {
    res.cookie(serverConfig.redisSession.app, req.session.id, {
      expires: new Date(Date.now() + ms),
      maxAge: ms,
      httpOnly: true,
      path: '/'
    });
    req.session.remember = false;
  }
};

/**
 * 设置cookie与会话的期限
 *
 * @param {Object} req
 */
utils.parseBody = function (req) {
  var body = req.body;
  var files = {};
  var fields = {};

  Object.keys(body).forEach(function (key) {
    var field = body[key];

    if (field.path) {
      files[key] = field;
    } else {
      fields[key] = field;
    }
  });

  return {
    files: files,
    fields: fields
  };
};

module.exports = utils;