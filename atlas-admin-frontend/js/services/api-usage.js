'use strict';
var app = angular.module('atlasAdmin.services.usage', []);

app.factory('APIUsage', ['$http', 'Authentication', 'atlasApiHost', '$q',
    function($http, Authentication, atlasApiHost, $q) {
    var _endpoint = atlasApiHost + '/usage';

    function key_use_day(apiKey) {
        var defer = $q.defer();
        var endpoint = [];
        endpoint.push(_endpoint);
        endpoint.push(apiKey)
        endpoint.push('day')
        endpoint = endpoint.join('/');
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
        day: key_use_day
    }
}]);