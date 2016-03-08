'use strict';

angular.module('atlasAdmin.manageRequests', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/manage/requests', {
      templateUrl: 'presentation/manageRequests/manageRequests.tpl.html',
      controller: 'CtrlManageSourceRequests'
    });
  }]);
