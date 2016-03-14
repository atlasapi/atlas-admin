'use strict';

angular.module('atlasAdmin.application', [
    'ngRoute',
    'atlasAdmin.directives.orderable',
    'atlasAdmin.directives.focus',
    'atlasAdmin.directives.validUsage',
    'atlasAdmin.services.atlas',
    'atlasAdmin.services.applications',
    'atlasAdmin.services.sources',
    'atlasAdmin.services.sourceRequests',
    'atlasAdmin.services.sourceLicenses',
    'atlasAdmin.services.apiUsage'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/applications/:applicationId', {
      templateUrl: 'app/presentation/application/application.tpl.html',
      controller: 'CtrlApplicationEdit',
      reloadOnSearch: false
    });
  }]);
