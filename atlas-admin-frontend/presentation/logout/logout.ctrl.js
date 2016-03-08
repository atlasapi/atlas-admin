'use strict';

angular.module('atlasAdmin.logout')
  .controller('CtrlLogout', function($scope, $rootScope, $routeParams, $location, Authentication) {
      // Ask atlas for access here
      $rootScope.title = "Logging out";
      Authentication.reset();
      $location.path("/login");
  });
