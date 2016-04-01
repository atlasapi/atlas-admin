'use strict';

angular
  .module('atlasAdmin.services.auth', ['ngCookies'])
  .factory('Authentication', Authentication);

Authentication.$inject = ['$rootScope', '$cookies'];

function Authentication($rootScope, $cookies) {
  var authCookieName = 'iPlanetDirectoryPro';

  if (!$rootScope.status) {
    $rootScope.status = {};
  }

  return {
    getToken: function () {
      return $cookies.get(authCookieName);
    },

    reset: function () {
      $cookies.remove(authCookieName);
      $rootScope.status.loggedIn = false;
    }
  };
}
