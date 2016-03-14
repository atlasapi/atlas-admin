'use strict';

angular.module('atlasAdmin.manageUsage', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/manage/usage', {
      templateUrl: 'app/presentation/manageUsage/manageUsage.tpl.html',
      controller: 'CtrlUsage'
    });
  }]);
