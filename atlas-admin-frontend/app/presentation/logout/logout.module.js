'use strict';

angular.module('atlasAdmin.logout', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/logout', {
      templateUrl: 'presentation/logout/logout.tpl.html',
      controller: 'CtrlLogout'
    });
  }]);
