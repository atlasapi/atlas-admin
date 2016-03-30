angular
  .module('atlasAdmin.services.users', ['ngCookies'])
  .factory('Users', Users)
  .factory('ProfileStatus', ProfileStatus);

Users.$inject = ['$http', 'Atlas', '$rootScope', 'Authentication', 'ProfileStatus', '$log', 'atlasApiHost', '$q', '$cookies'];

function Users($http, Atlas, $rootScope, Authentication, ProfileStatus, $log, atlasApiHost, $q, $cookies) {
  return {
    currentUser: function(callback) {
      var httpOptions = {
        headers: {
          iPlanetDirectoryPro: $cookies.get('iPlanetDirectoryPro')
        }
      };

      $http
        .get('http://admin-backend.metabroadcast.com/1/user', httpOptions)
        .then(function(result) {
          var user = result.data;
          callback(user);
        })
        .catch(function() {
          $log.error("No user");
          return null;
      });
    },

    update: function(user, callback) {
      ProfileStatus.setComplete(true);
      return Atlas.postRequest("/users/" + user.id + ".json", user);
    },

    get: function(uid) {
      return Atlas.getRequest('/users/' + uid + '.json').then(function(result) {
        return result.data.user;
      });
    },

    all: function() {
      return Atlas.getRequest('/users.json').then(function(result) {
        return result.data.users;
      });
    },

    getTermsAndConditions: function() {
      return Atlas.getRequest('/eula.json').then(function(result) {
        if (result.status > 399) {
          throw 'NOT_AVAILABLE/'+result.status;
        }

        return result.data.license.license;
      });
    },

    acceptTermsAndConditions: function(uid) {
      return Atlas.postRequest('/users/' + uid + '/eula/accept.json', {}).then(
        function(success) {
          return success;
        },
        function(error) {
          $log.error(error);
        }
      );
    },

    groups: function() {
      var defer = $q.defer();

      $http
        .get(Authentication.appendTokenToUrl(atlasApiHost+'/groups'))
        .then(defer.resolve)
        .catch(defer.reject);

      return defer.promise;
    }
  };
}

function ProfileStatus() {
  return {
    getLicenseAccepted: function() {
      if (localStorage.getItem("license.accepted")) {
        return localStorage.getItem("license.accepted") == "true";
      } else {
        return null;
      }
    },

    setLicenseAccepted: function (status) {
      return localStorage.setItem("license.accepted", status ? "true" : "false");
    },

    setComplete: function(status) {
      localStorage.setItem("profile.complete", status ? "true" : "false");
    },

    isProfileComplete: function() {
      return localStorage.getItem("profile.complete") == "true";
    }
  };
}
