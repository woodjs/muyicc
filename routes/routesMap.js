var initRoutesMap = function (router) {

  var articleArea = router.createArea('article');
  articleArea.mapRoute('/article/:controller?/:action?/:id?');

  var commonArea = router.createArea('common');
  commonArea.mapRoute('/', {
    controller: 'home',
    action: 'index'
  });
  commonArea.mapRoute('/:controller?/:action?/:id?');

};

module.exports = initRoutesMap;