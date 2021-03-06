'use strict';

angular.module('atlasAdmin.services.wishes')
  .factory('Wishes', ['$http', 'Authentication', 'atlasApiHost', '$q',
    function($http, Authentication, atlasApiHost, $q) {

    var endpoint = atlasApiHost + '/wishes';


    //  Get wishes for current user
    var getUserWishes = function(userId) {
        var defer = $q.defer();
        var userId = userId || 'current';
        $http({
            method: 'get',
            url: Authentication.appendTokenToUrl(endpoint+'/user/'+userId)
        })
        .success(function(data, status) {
            defer.resolve(data)
        })
        .error(function(data, status) {
            defer.reject('There was an error with the request. [status: '+status+']');
        });
        return defer.promise;
    }


    //  Create a new wish
    //
    //  @param wishdata {object} the wish data to be sent to the server
    var createWish = function(wishdata) {
        var defer = $q.defer();

        if ('object' !== typeof wishdata) {
            defer.reject('First argument should be object containing wish data');
            return;
        }
        $http({
            method: 'post',
            url: Authentication.appendTokenToUrl(endpoint),
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


    //  Get all wishes from the server
    //
    //  user must be admin to make this request
    var getAllWishes = function() {
        var defer = $q.defer();
        $http({
            method: 'get',
            url: Authentication.appendTokenToUrl(endpoint)
        })
        .success(function(data, status) {
            defer.resolve(data);
        })
        .error(function(data, status) {
            defer.reject('There was an error with the request. [status: '+status+']');
        })
        return defer.promise;
    }

    // expose the REST interface
    return {
        all: getAllWishes,
        create: createWish,
        user: getUserWishes
    }
}])
