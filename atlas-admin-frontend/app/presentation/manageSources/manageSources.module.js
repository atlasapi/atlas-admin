'use strict';

angular.module('atlasAdmin.manageSources', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/manage/sources', {
      templateUrl: 'app/presentation/manageSources/manageSources.tpl.html',
      controller: 'CtrlSources'
    });
  }]);
