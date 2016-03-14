'use strict';

angular.module('atlasAdmin.applications', [
    'ngRoute',
    'atlasAdmin.directives.focus',
    'atlasAdmin.services.atlas',
    'atlasAdmin.services.applications',
    'atlasAdmin.services.sourceRequests',
    'atlasAdmin.services.sourceLicenses'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/applications', {
      templateUrl: 'app/presentation/applications/applications.tpl.html',
      controller: 'CtrlApplications'
    });
  }]);
