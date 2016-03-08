'use strict';

angular.module('atlasAdmin.manageSources', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/manage/sources', {
      templateUrl: 'presentation/manageSources/manageSources.tpl.html',
      controller: 'CtrlSources'
    });
  }]);
