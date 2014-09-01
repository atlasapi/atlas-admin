'use strict'
var app = angular.module('atlasAdmin.services.sourceRequests');

app.factory('factorySourceRequests', ['$http', 'atlasApiHost', '$q', function($http, atlasApiHost, $q) {
    var endpoint = atlasApiHost + '/requests';

    // use POST to send source request data to the server
    // @returns promise {number} status code from server (eg. 200 is ok)
    var postRequest = function(data) {
        var defer = $q.defer();
        $http({
            method: 'post',
            url: endpoint,
            data: data
        })
        .success(function(data, status) {
            defer.resolve(status);
        })
        return defer.promise;
    }

    // use GET to ask the server for all unapproved source requests
    // @returns promise {object} 
    var getUnapprovedRequests = function() {
        var defer = $q.defer();
        $http({
            method: 'get',
            url: endpoint
        })
        .success(function(data) {
            defer.resolve(data)
        })
        return defer.promise;
    }

    // use PUT to update a source request
    // @returns promise {object}
    var putChangeRequest = function(data) {
        var defer = $q.defer();
        $http({
            method: 'put',
            url: endpoint,
            data: data
        })
        .success(function(status) {
            defer.resolve(status);
        });
        return defer.promise;
    }
    
    // expose REST interface
    return {
        postRequest: postRequest,
        getUnapprovedRequests: getUnapprovedRequests,
        putChangeRequest: putChangeRequest
    };
}]);
