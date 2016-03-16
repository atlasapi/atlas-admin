'use strict';

angular.module('atlasAdmin.manageSource', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/manage/sources/:sourceId', {
      templateUrl: 'presentation/manageSource/manageSource.tpl.html',
      controller: 'CtrlManageSource'
    });
  }]);
