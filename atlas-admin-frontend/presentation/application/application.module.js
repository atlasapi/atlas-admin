'use strict';

angular.module('atlasAdmin.applications', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/applications/:applicationId', {
      templateUrl: 'presentation/application/application.tpl.html',
      controller: 'CtrlApplicationEdit',
      reloadOnSearch: false
    });
  }]);
