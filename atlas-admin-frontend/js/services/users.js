var app = angular.module('atlasAdmin.services.users', []);

app.factory('Users', ['$http', 'Atlas', '$rootScope', 'Authentication', 'ProfileStatus', '$log', 'atlasApiHost', '$q', 'userUrl', function($http, Atlas, $rootScope, Authentication, ProfileStatus, $log, atlasApiHost, $q, userUrl) {
  return {
    currentUser: function(callback) {
      if (Cookies.get('iPlanetDirectoryPro')) {
        var options = {
          url: userUrl,
          headers: {
            iPlanetDirectoryPro: Cookies.get('iPlanetDirectoryPro')
          }
        };

        userMigration.isUserLoggedIn(options, function(user) {
          if (!user) {
            return;
          }

          var atlasUser = {
            id: user.attributes.mail,
            userRef: {},
            screen_name: user.attributes.mail,
            full_name: user.attributes.mail,
            email: user.attributes.mail,
            website: null,
            profile_image: null,
            applications: [],
            sources: [],
            role: '',
            profile_complete: '',
            license_accepted: ''
          };

          user.role.forEach(function(application) {
            atlasUser.applications.push(application.id);
          });

          callback(atlasUser);
        });

        return;
      }

      $.ajax({
        url: Atlas.getUrl('/auth/user.json'),
        success: function(result) {
          if (result.user) {
            if (result.user.profile_complete) {
              ProfileStatus.setComplete(result.user.profile_complete);
            }

            if (typeof result.user.license_accepted === 'string') {
              ProfileStatus.setLicenseAccepted(true);
            } else {
              ProfileStatus.setLicenseAccepted(false);
            }

            callback(result.user);
          }
        },

        error: function() {
          $log.error("No user");

          return null;
        }
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
      return Atlas.postRequest('/users/' + uid + '/eula/accept.json', {}).then(function(success) {
        return success;
      },

      function(error) {
        $log.error(error);
      });
    },

    groups: function() {
      var defer = $q.defer();

      $http({
        method: 'get',
        url: Authentication.appendTokenToUrl(atlasApiHost+'/groups')
      }).success(defer.resolve).error(defer.reject);

      return defer.promise;
    }
  };
}]);

app.factory('ProfileStatus', function() {
  return {
    getLicenseAccepted: function() {
      if (localStorage.getItem("license.accepted")) {
        return localStorage.getItem("license.accepted") == "true";
      } else {
        return null;
      }
    },

    setLicenseAccepted: function(status) {
      return localStorage.setItem("license.accepted", status ? "true" : "false");
    },

    setComplete: function(status) {
      localStorage.setItem("profile.complete", status ? "true" : "false");
    },

    isProfileComplete: function() {
      return localStorage.getItem("profile.complete") == "true";
    }
  };
});
