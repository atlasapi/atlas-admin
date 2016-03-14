'use strict';

angular.module('atlasAdmin.auth', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/oauth/:providerNamespace', {
      templateUrl: 'app/presentation/auth/auth.tpl.html',
      controller: 'CtrlOAuth',
      reloadOnSearch: false
    });
  }]);
