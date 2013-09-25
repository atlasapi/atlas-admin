'use strict';

/* Services */
angular.module('atlasAdmin.services', [])
 .factory('Sources', function ($http, atlasHost, Applications) {
    return {
        all: function () {
             return $http.get(atlasHost + '/sources.json').then(function(result) {return result.data.sources;});
        },
        get: function (sourceId) {
             return $http.get(atlasHost + '/sources/' + sourceId + '.json').then(function(result) {return result.data.source;});
        },
        changeAppState: function(sourceId, appId, state, callback) {
            var data = {"state":state};
            var url = atlasHost + "/sources/" + sourceId + "/applications/readers/" + appId + "/state";
            // DON'T DO $http POST here to avoid an OPTIONS request being issued.
            $http({url: url, method: 'POST', data: data, withCredentials: false}).success(callback);//.error(function(error) {console.log(error)});
        }
    }
 })
.factory('Applications', function ($http, atlasHost) {
    return {
        all: function () {
            return $http.get(atlasHost + '/applications.json').then(function (results) {return results.data.applications});
        },
        
    }
 });




