'use strict';

angular.module('atlasAdmin.services.propositions')
  .factory('factoryPropositions', ['$http', 'Authentication', 'atlasApiHost', '$q',
    function($http, Authentication, atlasApiHost, $q) {
    var endpoint = atlasApiHost + '/propositions';

    //  Get all propositions
    //
    //  @returns promise
    var all = function() {
        var defer = $q.defer();
        $http({
            method: 'get',
            url: Authentication.appendTokenToUrl(endpoint)
        })
        .success(function(data, status) {
            defer.resolve(data, status);
        })
        .error(function(data, status) {
            defer.reject('There was an error with the request. [status: '+status+']');
        });
        return defer.promise;
    }

    //  Create a new proposition on the server
    //
    //  @param data {object}
    //  @returns promise
    var createProposition = function(data) {
        var defer = $q.defer();
        if ('object' !== typeof data) {
            defer.reject('First argument should be data object');
            return;
        }
        var payload = data;
        $http({
            method: 'post',
            url: Authentication.appendTokenToUrl(endpoint),
            data: payload
        })
        .success(function(data, status) {
            defer.resolve(data, status)
        })
        .error(function(data, status) { defer.reject('There was an error with the request. [status: '+status+']'); });
        return defer.promise;
    }

    //  Delete a proposition on the server
    //
    //  @param data {object}
    //  @returns promise
    var removeProposition = function(itemId) {
        var defer = $q.defer();
        if ('object' !== typeof itemId) {
            defer.reject('First argument should be ID string');
            return;
        }
        $http({
            method: 'delete',
            url: Authentication.appendTokenToUrl(endpoint+'/'+itemId)
        })
        .success(function(data, status) {
            defer.resolve(data, status)
        })
        .error(function(data, status) { defer.reject('There was an error with the request. [status: '+status+']'); });
        return defer.promise;
    }

    //  Update a proposition on the server
    //
    //  @param data {object}
    //  @returns promise
    var updatePropositionStatus = function(itemId, status) {
        var defer = $q.defer();
        if ('string' !== typeof itemId || 'string' !== typeof status) {
            defer.reject('First argument should be ID string, the second should be status string')
            return;
        }
        var payload = { 'status': status }
        $http({
            method: 'post',
            url: Authentication.appendTokenToUrl(endpoint+'/'+itemId+'/status'),
            data: payload
        })
        .success(function(data, status) {
            defer.resolve(data, status);
        })
        .error(function(data, status) { defer.reject('There was an error with the request. [status: '+status+']'); })
        return defer.promise;
    }

    // expose the REST interface
    return {
        all: all,
        create: createProposition,
        remove: removeProposition,
        updateStatus: updatePropositionStatus
    }
}])
