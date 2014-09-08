'use strict';
var app = angular.module('atlasAdmin.services.wishlist', []);

app.factory('factoryWishlist', ['$http', 'Authentication', 'atlasApiHost', '$q', 
    function($http, Authentication, atlasApiHost, $q) {

    var endpoint = atlasApiHost + '/wishlist';

    // get all wishlist entries from the server
    // 
    // @param type {string} type of wishes to get (`sources` || 'features')
    var all = function(type) {
        var defer = $q.defer;
        $http({
            method: "get",
            url: Authentication.appendTokenToUrl(endpoint)
        })
        .success(function(data, status) {
            defer.resolve(data, status);
        });
        return defer.promise;
    }

    // expose the rest interface
    return {
        all: all
    }
}])