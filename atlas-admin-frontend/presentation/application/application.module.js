'use strict';

angular.module('atlasAdmin.application', ['ngRoute', 'atlasAdmin.orderable', 'atlasAdmin.focus'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/applications/:applicationId', {
      templateUrl: 'presentation/application/application.tpl.html',
      controller: 'CtrlApplicationEdit',
      reloadOnSearch: false
    });
  }]);
