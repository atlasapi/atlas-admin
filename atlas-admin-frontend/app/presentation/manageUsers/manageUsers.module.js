'use strict';

angular.module('atlasAdmin.manageUsers', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/manage/users', {
      templateUrl: 'app/presentation/manageUsers/manageUsers.tpl.html',
      controller: 'AllUsersController'
    });
  }]);
