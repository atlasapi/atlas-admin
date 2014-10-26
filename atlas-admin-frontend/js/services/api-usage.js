'use strict';
var app = angular.module('atlasAdmin.services.usage', []);

app.factory('APIUsage', ['$http', 'Authentication', 'atlasApiHost', '$q',
    function($http, Authentication, atlasApiHost, $q) {
    var _endpoint = atlasApiHost + '/usage';

    function urlJoin() {
        var args_length = arguments.length;
        if (args_length > 0) {
            var parts = Array.prototype.slice.call(arguments, 0);
            return parts.join('/');
        }
    }

    function key_use_day(apiKey) {
        var defer = $q.defer();
        var endpoint = urlJoin(_endpoint, apiKey, 'day');
        $http({
            method: 'get',
            url: Authentication.appendTokenToUrl(endpoint)
        })
        .success(function(data, status) { 
            if (status === 200) {
                defer.resolve(data);
            }else{
                defer.reject(status);
            }
        });
        return defer.promise;
    }

    function key_use_week(apiKey) {
        var defer = $q.defer();
        var endpoint = urlJoin(_endpoint, apiKey, 'week');
        $http({
            method: 'get',
            url: Authentication.appendTokenToUrl(endpoint)
        })
        .success(function(data, status) { 
            if (status === 200) {
                defer.resolve(data);
            }else{
                defer.reject(status);
            }
        });
        return defer.promise;
    }

    return {
        day: key_use_day,
        week: key_use_week
    }
}]);