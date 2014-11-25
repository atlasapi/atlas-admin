'use strict';
var app = angular.module('atlasAdmin.services.feeds', []);

app.factory('FeedsService', ['$http', 'Authentication', 'atlasApiHost', '$q',
    function($http, Authentication, atlasApiHost, $q) {

    //  Used for getting an array of available feeds for this user
    //
    //  @returns promise
    //
    var getFeeds = function() {
        var defer = $q.defer();
        $http({
            method: 'get',
            url: Authentication.appendTokenToUrl(atlasApiHost+'/feeds')
        })
        .success(function(data, status) {
            if (status === 200) {
                defer.resolve(data)
            }else{
                defer.reject(err);
            }
        })
        .error(function(data, status) {
            defer.reject(status);
        });
        return defer.promise;
    }

    //  Used for making a request
    //
    //  @param feed_uri {string}
    //  @param method {string}
    //  @param params {object}
    //  @returns promise
    //
    var request = function(feed_uri, method, params) {
        var request;
        var defer = $q.defer();
        var method = method || 'get';
        var params = params || null;

        if (!_.isString(feed_uri)) {
            defer.reject('Feed uri must be included as first argument')
            return defer.promise;
        }

        request = {
            method: method,
            url: Authentication.appendTokenToUrl(atlasApiHost+'/feeds/'+feed_uri)
        }

        if (_.isObject(params)) {
            request.data = params;
        }

        $http(request).success(defer.resolve);
        return defer.promise;
    }
    

    return {
        get: getFeeds,
        request: request
    }
}]);