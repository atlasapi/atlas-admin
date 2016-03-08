'use strict';

angular.module('atlasAdmin.login', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/login', {
      templateUrl: 'presentation/login/login.tpl.html',
      controller: 'CtrlLogin'
    });
    $routeProvider.when('/login/:providerNamespace', {
      templateUrl: 'presentation/login/login.tpl.html',
      controller: 'CtrlLogin'
    });
  }]);
