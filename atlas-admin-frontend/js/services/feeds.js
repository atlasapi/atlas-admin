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
    //  @returns promise
    //
    var request = function(feed_uri, annotations) {
        var defer = $q.defer(),
            _annotations = annotations || null;

        if (!_.isString(feed_uri)) {
            defer.reject('Feed uri must be included')
            return defer.promise;
        }

        $http({
            method: 'get',
            url: Authentication.appendTokenToUrl(atlasApiHost+'/feeds/'+feed_uri)
        })
        .success(function(data, status) {
            defer.resolve(data);
        });

        return defer.promise;
    }
    

    return {
        get: getFeeds,
        request: request
    }
}]);