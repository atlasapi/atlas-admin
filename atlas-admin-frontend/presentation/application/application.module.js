'use strict';

angular.module('atlasAdmin.application', [
    'ngRoute',
    'atlasAdmin.directives.orderable',
    'atlasAdmin.directives.focus',
    'atlasAdmin.directives.validUsage',
    'atlasAdmin.services.atlas',
    'atlasAdmin.services.applications',
    'atlasAdmin.services.sources'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/applications/:applicationId', {
      templateUrl: 'presentation/application/application.tpl.html',
      controller: 'CtrlApplicationEdit',
      reloadOnSearch: false
    });
  }]);
