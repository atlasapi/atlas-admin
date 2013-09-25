'use strict';

/* Services */
angular.module('atlasAdmin.services', [])
 .factory('Sources', function ($http, atlasHost, Applications) {
    return {
        all: function () {
             return $http.jsonp(atlasHost + '/sources.json?callback=JSON_CALLBACK').then(function(result) {return result.data.sources;});
        },
        get: function (sourceId) {
             return $http.jsonp(atlasHost + '/sources/' + sourceId + '.json?callback=JSON_CALLBACK').then(function(result) {return result.data.source;});
        },
        changeAppState: function(sourceId, appId, state, callback) {
            var data = {"state":state};
            // POST /4.0/sources/:sourceId/applications/readers/:appId/state
            var url = atlasHost + "/sources/" + sourceId + "/applications/readers/" + appId + "/state";
            
            $http.post(url, data).success(callback);
            
        }
    }
 })
.factory('Applications', function ($http, atlasHost) {
    return {
        all: function () {
            return $http.jsonp(atlasHost + '/applications.json?callback=JSON_CALLBACK').then(function (results) {return results.data.applications});
        },
        
    }
 });




