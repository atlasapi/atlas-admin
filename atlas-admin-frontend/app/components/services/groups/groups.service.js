'use strict';

angular
  .module('atlasAdmin.services.users')
  .factory('GroupsService', GroupsService);

GroupsService.$inject = ['$http', 'Authentication', 'atlasApiHost', '$q'];

function GroupsService($http, Authentication, atlasApiHost, $q) {
  //  Used for getting an array of available groups for this user
  //
  //  @returns promise
  //
  var getGroups = function() {
    var defer = $q.defer();

    $http
      .get(Authentication.appendTokenToUrl(atlasApiHost+'/user/groups'))
      .then(function(data, status) {
        if (status === 200) {
          defer.resolve(data)
        } else {
          defer.reject(new Error('Groups endpoint responded with status: ' + status));
        }
      })
      .catch(function(data, status) {
        defer.reject(status);
    });

    return defer.promise;
  };

  return {
    get: getGroups
  };
}
