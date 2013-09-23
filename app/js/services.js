'use strict';

/* Services */
angular.module('atlasAdmin.services', [])
  .factory('AllSources', function($resource, atlasHost){
  return $resource(atlasHost + '/sources.json?callback=JSON_CALLBACK', {}, {
    query: {method:'JSONP', params:{}, isArray:true}
  });
});




