'use strict';

angular.module('atlasAdmin.applications', ['ngRoute', 'atlasAdmin.directives.focus'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/applications', {
      templateUrl: 'presentation/applications/applications.tpl.html',
      controller: 'CtrlApplications'
    });
  }]);
