'use strict';

angular.module('atlasAdmin.manageUser', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/manage/users/:uid', {
      templateUrl: 'presentation/manageUser/manageUser.tpl.html',
      controller: 'UserProfileController'
    });
  }]);
