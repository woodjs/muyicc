var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var connectRedisSessions = require('connect-redis-sessions');
var gu = require('guthrie-js');
var expressFormidable = require('express-formidable');
var routesMap = require('./routes/routesMap');
var config = require('./config');
var initApp = require('./core/initApp');
var fixModuleBug = require('./core/fixModuleBug');

var app = express();
var crs = connectRedisSessions(config.redisSession);

initApp();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/img', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressFormidable.parse({
  uploadDir: path.join(__dirname, './upload/'),
  keepExtensions: true
}));
app.use(fixModuleBug.changeCrsValidRegExp(crs));
app.use(express.static(path.join(__dirname, 'public')));

var router = new gu.Router(app, __dirname);

routesMap(router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error/error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error/error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
