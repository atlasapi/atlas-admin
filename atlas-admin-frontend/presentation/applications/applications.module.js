'use strict';

angular.module('atlasAdmin.applications', ['ngRoute', 'atlasAdmin.focus', 'atlasAdmin.atlas'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/applications', {
      templateUrl: 'presentation/applications/applications.tpl.html',
      controller: 'CtrlApplications'
    });
  }]);
