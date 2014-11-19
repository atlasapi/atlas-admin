'use strict';
var app = angular.module('atlasAdmin.services.users');

app.factory('GroupsService', ['$http', 'Authentication', 'atlasApiHost', '$q',
    function($http, Authentication, atlasApiHost, $q) {

    //  Used for getting an array of available groups for this user
    //
    //  @returns promise
    //
    var getGroups = function() {
        var defer = $q.defer();
        $http({
            method: 'get',
            url: Authentication.appendTokenToUrl(atlasApiHost+'/user/groups')
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

    return {
        get: getGroups
    }
}]);