requirejs.config({
  baseUrl: '../js/',
  paths: {
    //lib
    jquery: 'lib/jquery-2.2.3.min',
    domReady: 'lib/domReady-2.0.1',

    //component

    //app
    index: 'app/index'

  },
  shim: {

  }
});

require(requiredModuleList);