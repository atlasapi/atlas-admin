'use strict';

angular.module('atlasAdmin.error', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/error', {
      templateUrl: 'app/presentation/error/error.tpl.html',
      controller: 'ErrorController',
      reloadOnSearch: false
    });
  }]);
