'use strict';

/* User Profile Controller */

var app = angular.module('atlasAdmin.controller.user', []);
app.controller('UserProfileController', function($scope, $rootScope, $routeParams, Users) {
      $rootScope.title = "Your profile";
      $scope.app = {};
      $scope.app.user = Users.currentUser();
});