'use strict';

angular.module('atlasAdmin.manageRequests', [
    'ngRoute',
    'atlasAdmin.services.applications',
    'atlasAdmin.services.sourceRequests',
    'atlasAdmin.services.users'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/manage/requests', {
      templateUrl: 'app/presentation/manageRequests/manageRequests.tpl.html',
      controller: 'CtrlManageSourceRequests'
    });
  }]);
