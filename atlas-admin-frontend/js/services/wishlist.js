'use strict';

var app = angular.module('atlasAdmin.services.wishlist', []);

app.factory('factoryWishlist', ['$http', 'Authentication', 'atlasApiHost', '$q', 
    function($http, Authentication, atlasApiHost, $q) {

    var endpoint = atlasApiHost + '/wishlist';


    // get all wishlist entries from the server
    // 
    // @param type {string} type of wishes to get (`source` || 'feature')
    var all = function(type) {
        var defer = $q.defer();
        var type = (type === 'source' || type === 'feature')? '/'+type : '';
        $http({
            method: 'get',
            url: Authentication.appendTokenToUrl(endpoint+type)
        })
        .success(function(data, status) {
            defer.resolve(data, status);
        })
        .error(function(data, status) {
            defer.reject('There was an error with the request. [status: '+status+']');
        });
        return defer.promise;
    }

    var getUserWishes = function() {
        var defer = $q.defer();
        $http({
            method: 'get',
            url: Authentication.appendTokenToUrl(endpoint+'/user')
        })
        .success(function(data, status) {
            defer.resolve(data)
        })
        .error(function(data, status) {
            defer.reject('There was an error with the request. [status: '+status+']');
        });
        return defer.promise;
    }


    // send a new wish request to the server
    //
    // @param wishdata {object} the wish data to be sent to the server
    var createWish = function(wishdata) {
        var defer = $q.defer();

        if ('object' !== typeof wishdata) {
            defer.reject('First argument should be object containing wish data');
            return;
        }

        $http({
            method: 'post',
            url: Authentication.appendTokenToUrl(endpoint+'/create'),
            data: wishdata
        })
        .success(function(data, status) {
            defer.resolve(data, status);
        })
        .error(function(data, status) {
            defer.reject('There was an error with the request. [status: '+status+']');
        })
        return defer.promise;
    }

    // expose the REST interface
    return {
        all: all,
        createWish: createWish,
        getUserWishes: getUserWishes
    }
}])