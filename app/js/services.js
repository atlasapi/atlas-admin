'use strict';

/* Services */
angular.module('atlasAdmin.services', [])
  .factory('AllSources', function($resource, atlasHost){
      var url = atlasHost + '/sources.json?callback=JSON_CALLBACK';
      console.log(url);
  return $resource(url, {"8080": ":8080"}, {}, {
    query: {method:'JSONP', params:{}, isArray:true}
  });
}).factory('Sources', function ($http, atlasHost) {
    return {
        all: function (callback) {
             $http.jsonp(atlasHost + '/sources.json?callback=JSON_CALLBACK').success(callback);
        },
        
    }
});




