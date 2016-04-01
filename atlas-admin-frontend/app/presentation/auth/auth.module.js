'use strict';

angular
  .module('atlasAdmin.auth', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/oauth/:providerNamespace', {
      templateUrl: 'presentation/auth/auth.tpl.html',
      controller: 'CtrlAuth',
      reloadOnSearch: false
    });
  }]);
