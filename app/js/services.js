'use strict';

/* Services */
angular.module('atlasAdmin.services', [])
  .factory('AllSources', function($resource){
  return $resource($atlasHost + '/sources.json?callback=JSON_CALLBACK', {}, {
    query: {method:'JSONP', params:{}, isArray:true}
  });
});




