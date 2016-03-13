'use strict';

angular.module('atlasAdmin.applications', [
    'ngRoute',
    'atlasAdmin.directives.focus',
    'atlasAdmin.services.atlas',
    'atlasAdmin.services.applications',
    'atlasAdmin.services.sourceRequests'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/applications', {
      templateUrl: 'presentation/applications/applications.tpl.html',
      controller: 'CtrlApplications'
    });
  }]);
