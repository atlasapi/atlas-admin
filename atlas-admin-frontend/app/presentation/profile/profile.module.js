'use strict';

angular.module('atlasAdmin.profile', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/profile', {
      templateUrl: 'app/presentation/profile/profile.tpl.html',
      controller: 'ProfileController'
    });
  }]);
