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
            var data = {};
            var url = atlasHost + "/sources/" + sourceId + "/applications/readers/" + appId + "/state?state="+ state;
            $http.post(url, data, {withCredentials: false}).success(callback);//.error(function(error) {console.log(error)});
        },
        addWriter: function(sourceId, appId, callback) {
            var url = atlasHost + "/sources/" + sourceId + "/applications?id=" + appId + "&permission=write";
            $http.post(url, {}, {withCredentials: false}).success(callback);
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




