'use strict';

angular.module('atlasAdmin.application', ['ngRoute', 'atlasAdmin.orderable', 'atlasAdmin.focus', 'atlasAdmin.validUsage', 'atlasAdmin.services.atlas', 'atlasAdmin.services.applications'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/applications/:applicationId', {
      templateUrl: 'presentation/application/application.tpl.html',
      controller: 'CtrlApplicationEdit',
      reloadOnSearch: false
    });
  }]);
