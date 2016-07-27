var fixModuleBug = {};

fixModuleBug.changeCrsValidRegExp = function (crs) {

  crs.handler.rds._VALID['id'] = /^([a-zA-Z0-9_\.-]){1,64}$/;

  return crs;
};


module.exports = fixModuleBug;